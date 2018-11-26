import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/';
import { pathOr, pick, contains, complement, isNil } from 'ramda';
import { FileTransfer, FileUploadResult } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture';
import {
  ViewController, ActionSheetController, Platform,
  ActionSheetOptions, LoadingController, Loading, AlertController,
} from 'ionic-angular';

import { AppState } from './../../../../app.reducer';
import { generateS3Key } from '../../../../helpers/s3-key-generator';
import { sliceUpToLastSlash } from '../../../../helpers/slice-up-to-last-slash';
import { createUniqFileName } from '../../../../helpers/create-uniq-file-name';
import { getFileUploadOptions } from '../../../../helpers/get-file-upload-options';
import { contentTypeFromExtension } from '../../../../helpers/content-type-from-extension';
import { addFilePathPrefix } from '../../../../helpers/add-file-path-prefix';
import { getFileNameFromXml } from '../../../../helpers/get-file-name-from-xml';
import { didUserCancel } from '../../../../helpers/did-user-cancel';
import {
  Task, TaskAttachmentParams, TaskAttachmentPayload, AttachmentCountActionType,
} from './../../../../models/tasks/task.model';
import { removeAttachment, addAttachment } from './../../actions/task.actions';
import { amazonUrl, bucket } from './../../../../endpoints/amazon-endpoint';
import { User } from '../../../user/actions/user.actions';
import { AndroidPermissions } from '@ionic-native/android-permissions';

const isDefined = complement(isNil);

@Component({
  selector: 'modal-task-attachments',
  templateUrl: 'task-attachments.modal.html',
  styles: [ 'task-attachments.modal.scss' ],
})
export class TaskAttachmentsModal {
  public currentUser: User;
  private killer$ = new Subject<any>();
  private lastMediaName: string;
  private lastS3Key: string;
  private loading: Loading;
  private task: Task;
  private attachmentParams;
  private fileType: string;
  private storageDirectory: string;

  constructor(
    private store: Store<AppState>,
    private viewCtrl: ViewController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private mCapture: MediaCapture,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private transfer: FileTransfer,
    private alertCtrl: AlertController,
    private androidPermissions: AndroidPermissions
  ) {}

  public ionViewWillLoad(): void {
    this.fetchCurrentUser();

    const { data } = this.viewCtrl.getNavParams();

    const attrs = [ 'projectId', 'taskId', 'stageId', 'swimlaneId', 'dueDateBlock' ];

    this.attachmentParams = pick(attrs, data);

    this.store
      .select<Task>('task', 'fetchTask', 'value')
      .filter(isDefined)
      .takeUntil(this.killer$)
      .subscribe((task) => {
        this.task = task;
      });

    if (isDefined(cordova)) {
      this.storageDirectory = cordova.file.dataDirectory;
    }
  }

  public ionViewWillUnload(): void {
    this.killer$.next();
  }

  public trackById(_, item): number {
    if (isDefined(item)) {
      return item.id;
    }
  }

  public selectMediaSource(): void {
    const options: ActionSheetOptions = {
      title: 'Select The Media Source',
      buttons: [
        {
          handler: () => this.selectMediaFromLibrary(),
          text: 'Load from Library',
        },
        {
          handler: () => this.handleMediaCapture('video'),
          text: 'Record Video',
        },
        {
          handler: () => this.handleMediaCapture('image'),
          text: 'Take Photo',
        },
        {
          role: 'cancel',
          text: 'Cancel',
        },
      ],
    };

    this.actionSheetCtrl.create(options).present();
  }

  public dismiss(): void {
    this.viewCtrl.dismiss();
  }

  public openLink(url: string): void {
    window.open(url, '_system');
  }

  public removeAttachment(attachmentId: number): void {
    const actionType: AttachmentCountActionType = 'remove';

    const payload: TaskAttachmentParams = {
      attachmentId,
      type: actionType,
      ...this.attachmentParams,
    };
    this.store.dispatch(removeAttachment(payload));
  }

  private selectMediaFromLibrary(): void {
    const options: CameraOptions = {
      quality: 50,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.ALLMEDIA,
    };

    this.camera
      .getPicture(options)
      .then(this.handleFileSelection.bind(this), this.handleError.bind(this));
  }

  private handleFileSelection(imagePath): void {
    if (this.platform.is('android')) {
      this.handleSelectionForAndroid(imagePath);
    } else {
      this.handleSelectionForIOs(imagePath);
    }
  }

  private handleError(error: any): void {
    if (didUserCancel(error)) {
      return;
    }

    const errorType = pathOr('', ['constructor', 'name'], error);

    this.alertCtrl
      .create({
        title: 'Upload Failed!',
        subTitle: `Error: ${errorType} ${JSON.stringify(error)}`,
        buttons: ['Ok'],
      })
      .present();
  }

  private handleSelectionForAndroid(imagePath: string): void {
    // Fix the URI if the file:// part is missing
    const path = addFilePathPrefix(imagePath);

    const startIdx = path.lastIndexOf('/') + 1;
    const isQuestionMarkInPath = contains('?', imagePath);
    const endIdx = isQuestionMarkInPath ? path.lastIndexOf('?') : undefined;
    const currentFileName = path.substring(startIdx, endIdx);

    this.fileType = contentTypeFromExtension(currentFileName);

    this.filePath
      .resolveNativePath(path)
      .then(this.handleResolvedPath(currentFileName), this.handleError.bind(this));
  }

  private handleSelectionForIOs(imagePath: string): void {
    const correctPath = sliceUpToLastSlash(imagePath);
    const currentFileName = imagePath.substr(imagePath.lastIndexOf('/') + 1);

    this.fileType = contentTypeFromExtension(currentFileName);
    this.copyFileToLocalDir(correctPath, currentFileName);
  }

  private handleResolvedPath(currentFileName: string) {
    return (pathToFile) => {
      const correctPath = sliceUpToLastSlash(pathToFile);
      this.copyFileToLocalDir(correctPath, currentFileName);
    };
  }

  private handleMediaCapture(mediaType: string): void {
    let promise: Promise<CaptureError|MediaFile[]>;
    
    let permissions = this.androidPermissions;
    // console.log(this.androidPermissions);
    //
    // permissions.checkPermission(permissions.PERMISSION.CAMERA).then(
    //   result => console.log('Has permission?',result.hasPermission),
    //   err => permissions.requestPermissions([permissions.PERMISSION.CAMERA, permissions.PERMISSION.GET_ACCOUNTS, permissions.PERMISSION.WRITE_EXTERNAL_STORAGE])
    // );

    permissions.requestPermissions([permissions.PERMISSION.CAMERA, permissions.PERMISSION.WRITE_EXTERNAL_STORAGE]).then(() => {
      
      if (mediaType === 'video') {
        promise = this.mCapture.captureVideo();
      }

      if (mediaType === 'image') {
        promise = this.mCapture.captureImage();
      }

      promise.then(this.handleCapturedMedia.bind(this), this.handleError.bind(this));
    }
    );
    

  }

  private handleCapturedMedia(result: MediaFile[]): void {
    const [ file ] = result;
    const path = sliceUpToLastSlash(file.fullPath);
    this.copyFileToLocalDir(path, file.name);
    this.fileType = file.type;
  }

  private copyFileToLocalDir(path: string, currentName: string): void {
    if (isNil(cordova)) {
      return;
    }
    // Fix the URI if the file:// part is missing on iOS platform
    const fixedPath = addFilePathPrefix(path);
    const newFileName = createUniqFileName(currentName);

    this.file
      .copyFile(fixedPath, currentName, this.storageDirectory, newFileName)
      .then(() => {
        this.lastMediaName = newFileName;
        this.uploadImage();
      }, this.handleError.bind(this));
  }

  private uploadImage(): void {
    this.loading = this.loadingCtrl.create({ content: 'Uploading...' });

    this.loading.present();

    this.lastS3Key = generateS3Key();

    const key = this.lastS3Key + this.lastMediaName;

    const options = getFileUploadOptions({
      key,
      fileType: this.fileType,
      mediaName: this.lastMediaName,
      task: this.task,
    });

    this.transfer.create()
      .upload(this.pathForMedia, amazonUrl, options)
      .then(this.handleUploadedMedia.bind(this), this.handleError.bind(this));
  }

  private handleUploadedMedia(result: FileUploadResult) {
    const s3name = getFileNameFromXml(result.response);
    const actionType: AttachmentCountActionType = 'add';
    const payload: TaskAttachmentPayload = {
      data: {
        bucket,
        s3name,
        key: this.lastS3Key,
        name: this.lastMediaName,
      },
      params: { ...this.attachmentParams, type: actionType },
    };
    this.store.dispatch(addAttachment(payload));
    this.loading.dismissAll();
    this.fileType = '';
  }

  private fetchCurrentUser(): void {
    this.store.select<User>('user', 'fetchCurrentUser', 'value')
      .filter(user => user != null)
      .takeUntil(this.killer$)
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  private get pathForMedia(): string {
    const EMPTY = '';
    if (isDefined(cordova)) {
      return isNil(this.lastMediaName) ? EMPTY : this.storageDirectory + this.lastMediaName;
    }
    return EMPTY;
  }

}
