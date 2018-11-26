import { Component, ViewChild, ElementRef, ViewContainerRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ViewController, ActionSheetController, ActionSheetOptions,
  Platform, LoadingController, Loading, AlertController, TextInput,
} from 'ionic-angular';
import { FileTransfer, FileTransferObject, FileUploadResult } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture';
import { Subject } from 'rxjs/';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';

import { generateS3Key } from '../../../../helpers/s3-key-generator';
import { sliceUpToLastSlash } from '../../../../helpers/slice-up-to-last-slash';
import { createUniqFileName } from '../../../../helpers/create-uniq-file-name';
import { contentTypeFromExtension } from '../../../../helpers/content-type-from-extension';
import { getFileUploadOptions } from '../../../../helpers/get-file-upload-options';
import { addFilePathPrefix } from '../../../../helpers/add-file-path-prefix';
import { getFileNameFromXml } from '../../../../helpers/get-file-name-from-xml';
import { getInnerHtml } from './../../../../helpers/get-inner-html';
import { didUserCancel } from './../../../../helpers/did-user-cancel';
import { AppState } from './../../../../app.reducer';
import {
  pathOr, compose, contains, find, propEq, head,
  defaultTo, isNil, propOr, or, equals, prop,
  when, complement, length, propSatisfies, clone,
} from 'ramda';
import { Task } from './../../../../models/tasks/task.model';
import {
  FetchedComment, CommentAttachmentPayload, CommentParams,
  CommentAttachmentParams, Attachment, Commenter,
} from './../../../../models/task-comment/task-comment.model';
import { addAttachmentToComment, editComment, removeAttachmentFromComment } from './../../actions/task-comment.actions';
import { amazonUrl, bucket } from './../../../../endpoints/amazon-endpoint';
import { Content } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { parseUsersToMentionNamesAndIds } from '../../../../helpers/parse-users-to-mention-names-and-ids';
import { path } from 'ramda';

const getAttachmentsCount = compose<FetchedComment, Attachment[], number>(length, propOr([], 'attachments'));
const notEqual = complement(equals);
const isDefined = complement(isNil);
const ALL_USERS_ID = -999;

@Component({
  selector: 'modal-task-comment',
  templateUrl: 'task-comment.modal.html',
  styles: [ 'task-comment.modal.scss' ],
})
export class TaskCommentModal implements OnInit {
  public keyboardHeight = 0;
  public taskUsers: Commenter[];

  @ViewChild(Content) private content: Content;
  @ViewChild('textInput') private textInputRef: TextInput;
  @ViewChild('textInput') private textAreaInputRef: any;
  private commentId: number = this.viewCtrl.data.commentId;
  private task: Task = this.viewCtrl.data.task;
  private comment: FetchedComment;
  private initialComment: string;
  private initialAttachmentsCount: number;
  private lastMediaName: string;
  private lastS3Key: string;
  private loading: Loading;
  private killer$: Subject<any> = new Subject();
  private fileType: string;
  private storageDirectory: string;
  private mentionedNames: string[] = [];
  private currentMentionNames: string[] = [];
  private mentionedIds: number[] = [];
  private viewHeight: number;
  private isIos: boolean;

  constructor(
    public platform: Platform,
    public viewContainerRef: ViewContainerRef,
    private store: Store<AppState>,
    private viewCtrl: ViewController,
    private actionSheetCtrl: ActionSheetController,
    private transfer: FileTransfer,
    private file: File,
    private filePath: FilePath,
    private camera: Camera,
    private mCapture: MediaCapture,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private elementRef: ElementRef,
    private keyboard: Keyboard,
  ) {}

  public ionViewWillLoad() {
    this.keyboard.disableScroll(true);
    this.resizeAreaUnderKeyboard();
    this.touchBlocking();
    this.fetchComment();
    this.storageDirectory = pathOr('', ['cordova', 'file', 'dataDirectory'])(window);
    this.fetchTaskUsers();
  }

  public ngOnInit() {
    this.isIos = this.platform.is('ios');
  }

  public ionViewDidLoad() {
    this.viewHeight = path<number>(['element', 'nativeElement', 'offsetHeight'], this.viewContainerRef);
  }

  public ionViewWillUnload(): void {
    this.touchBlockingRemove();
    this.killer$.next();
  }

  public trackById(_, item): number {
    return when<any, number>(isDefined, prop('id'))(item);
  }

  public dismiss() {
    this.checkIfCurrentMentionsExistInTextArea();
    if (this.commentIsValidAndChanged) {
      const payload: CommentParams = {
        comment: this.commentContent,
        commentId: this.commentId,
        projectId: this.task.project_id,
        taskId: this.task.id,
        mentions: this.mentionedUsersIdsToSend,
      };
      this.store.dispatch(editComment(payload));
    }
    this.lastMediaName = null;
    this.viewCtrl.dismiss();
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

  public removeAttachment(attachmentId): void {
    const params: CommentAttachmentParams = {
      attachmentId,
      commentId: this.commentId,
      projectId: this.task.project_id,
      taskId: this.task.id,
    };
    this.store.dispatch(removeAttachmentFromComment(params));
  }

  public openLink(url: string): void {
    window.open(url, '_system');
  }

  public addMentionIdToArray(userName: string) {
    if (!contains( userName, this.mentionedNames)) {
      this.mentionedNames.push(userName);
    }
  }

  private fetchTaskUsers() {
    this.store.select<Commenter[]>('task', 'fetchTask', 'value', 'users')
      .takeUntil(this.killer$)
      .filter(isDefined)
      .subscribe((users) => {
        this.taskUsers = [...users, { email: 'all users', id: ALL_USERS_ID }];
      });
  }

  private touchBlocking() {
    const element = this.elementRef.nativeElement;

    element.addEventListener('touchstart', (event) => {
      event.stopPropagation();
    });

    element.addEventListener('touchmove', (event) => {
      event.stopPropagation();
    });

    element.addEventListener('touchend', (event) => {
      event.stopPropagation();
    });
  }

  private touchBlockingRemove() {
    const element = this.elementRef.nativeElement;
    element.removeEventListener('touchstart');
    element.removeEventListener('touchend');
    element.removeEventListener('touchmove');
  }

  private resizeAreaUnderKeyboard() {
    this.keyboard.onKeyboardShow().takeUntil(this.killer$).subscribe((event) => {
      this.keyboardHeight = event.keyboardHeight + 20;
    });

    this.keyboard.onKeyboardHide().takeUntil(this.killer$).subscribe((event) => {
      this.keyboardHeight = 0;
    });
  }

  private fetchComment(): void {
    this.store.
      select<FetchedComment[]>('taskComment', 'fetchComments', 'value')
      .filter(isDefined)
      .takeUntil(this.killer$)
      .map(compose(
        defaultTo({ attachments: [], comment: '' }),
        find(propEq('id', this.commentId))
      ))
      .subscribe(this.assignComment.bind(this));
  }

  private assignComment(comment: FetchedComment): void {
    this.comment = comment;
    this.initialComment = propOr<string, FetchedComment, string>('', 'comment', comment);
    this.initialAttachmentsCount = getAttachmentsCount(comment);
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

    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer
      .upload(this.pathForMedia, amazonUrl, options)
      .then(this.handleUploadedMedia.bind(this), this.handleError.bind(this));
  }

  private handleUploadedMedia(result: FileUploadResult) {
    const s3name = getFileNameFromXml(result.response);
    const payload: CommentAttachmentPayload = {
      params: {
        projectId: this.task.project_id,
        taskId: this.task.id,
        commentId: this.comment.id,
      },
      data: {
        bucket,
        s3name,
        name: this.lastMediaName,
        key: this.lastS3Key,
      },
    };

    this.store.dispatch(addAttachmentToComment(payload));
    this.loading.dismissAll();
    this.fileType = '';
  }

  private copyFileToLocalDir(pathToFile: string, currentName: string): void {
    if (propSatisfies(isNil, 'cordova', window)) {
      return;
    }
    // Fix the URI if the file:// part is missing on iOS platform
    const fixedPath = addFilePathPrefix(pathToFile);
    const newFileName = createUniqFileName(currentName);

    this.file
      .copyFile(fixedPath, currentName, this.storageDirectory, newFileName)
      .then(() => {
        this.lastMediaName = newFileName;
        this.uploadImage();
      }, this.handleError.bind(this));
  }

  private handleFileSelection(imagePath) {
    if (this.platform.is('android')) {
      this.handleSelectionForAndroid(imagePath);
    } else {
      this.handleSelectionForIOs(imagePath);
    }
  }

  private handleSelectionForIOs(imagePath: string): void {
    const correctPath = sliceUpToLastSlash(imagePath);
    const currentFileName = imagePath.substr(imagePath.lastIndexOf('/') + 1);

    this.fileType = contentTypeFromExtension(currentFileName);
    this.copyFileToLocalDir(correctPath, currentFileName);
  }

  private handleSelectionForAndroid(imagePath: string): void {
    // Fix the URI if the file:// part is missing
    const pathToFile = addFilePathPrefix(imagePath);
    const startIdx = pathToFile.lastIndexOf('/') + 1;
    const isQuestionMarkInPath = contains('?', imagePath);
    const endIdx = isQuestionMarkInPath ? pathToFile.lastIndexOf('?') : undefined;
    const currentFileName = pathToFile.substring(startIdx, endIdx);

    this.fileType = contentTypeFromExtension(currentFileName);

    this.filePath
      .resolveNativePath(pathToFile)
      .then(this.handleResolvedPath(currentFileName), this.handleError.bind(this));
  }

  private handleResolvedPath(currentFileName: string) {
    return (pathToFile) => {
      const correctPath = sliceUpToLastSlash(pathToFile);
      this.copyFileToLocalDir(correctPath, currentFileName);
    };
  }

  private handleMediaCapture(mediaType: string): void {
    let promise: Promise<CaptureError|MediaFile[]>;
    const mediaTypeEquals = equals(mediaType);

    if (mediaTypeEquals('video')) {
      promise = this.mCapture.captureVideo();
    }

    if (mediaTypeEquals('image')) {
      promise = this.mCapture.captureImage();
    }

    promise.then(this.handleCapturedMedia.bind(this), this.handleError.bind(this));
  }

  private handleCapturedMedia(result: MediaFile[]): void {
    const file = head(defaultTo([], result));
    const pathToFile = sliceUpToLastSlash(file.fullPath);
    this.copyFileToLocalDir(pathToFile, file.name);
    this.fileType = file.type;
  }

  private get pathForMedia(): string {
    const EMPTY = '';
    if (propSatisfies(isDefined, 'cordova', window)) {
      return isNil(this.lastMediaName) ? EMPTY : this.storageDirectory + this.lastMediaName;
    }
    return EMPTY;
  }

  private checkIfCurrentMentionsExistInTextArea() {
    const elRef: ElementRef = this.textInputRef.getElementRef();
    const commentVal = elRef.nativeElement.textContent;
    this.currentMentionNames = this.mentionedNames.filter(name => commentVal.includes(name));
  }

  private get mentionedUsersIdsToSend() {
    const taskUsersMentionNamesAndIds = parseUsersToMentionNamesAndIds(this.taskUsers);
    return taskUsersMentionNamesAndIds
      .filter((user: Commenter) => this.currentMentionNames.includes(user.name))
      .map(user => user.id);
  }

  private get commentIsValidAndChanged(): boolean {
    const textDidChange = notEqual(this.initialComment, this.commentContent);
    const attachmentsDidChange = notEqual(this.initialAttachmentsCount, getAttachmentsCount(this.comment));
    return or(textDidChange, attachmentsDidChange);
  }

  private get commentContent(): string {
    const elRef: ElementRef = this.textInputRef.getElementRef();
    return getInnerHtml(elRef);
  }
}
