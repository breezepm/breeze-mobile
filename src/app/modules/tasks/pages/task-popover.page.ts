import { Component } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard';
import { AlertController, PopoverController } from 'ionic-angular';
import { ViewController, ActionSheetController } from 'ionic-angular';
import { AppState } from '../../../app.reducer';
import { Store } from '@ngrx/store';
import { deleteTaskFromProject } from './../../projects/actions/project.actions';
import { deleteTaskFromActivity } from './../../activity/actions/activity.actions';
import {
  TaskParams, deleteTaskLayoutDueDate, deleteTaskLayoutProject,
} from './../actions/task.actions';
import { Task } from './../../../models/tasks/task.model';
import { User } from './../../../models/user/user-credentials.model';

@Component({
  selector: 'page-task-popover',
  templateUrl: 'task-popover.page.html',
})
export class TaskPopoverPage {
  public isDeleteButtonVisible = this.task != null && !this.task.deleted_at && !this.currentUser.observer;

  constructor(
    private viewCtrl: ViewController,
    private actionSheetCtrl: ActionSheetController,
    private store: Store<AppState>,
    private clipboard: Clipboard,
    private alertCtrl: AlertController
  ) {}

  public copyTaskLink(): void {
    this.clipboard.copy(this.taskLink);

    this.clipboard.paste()
      .catch(() => {
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Error during pasting content from the clipboard',
          buttons: ['OK'],
        });
        alert.present();
      }
    );

    this.viewCtrl.dismiss(false);
  }

  public deleteTask(): void {
    const actionSheet = this.actionSheetCtrl
      .create({
        buttons: [
          {
            text: 'Archive',
            role: 'destructive',
            handler: () => {
              this.handleDelete();
              actionSheet.dismiss();
              this.viewCtrl.dismiss(true);
              return false;
            },
          },
        ],
      });

    actionSheet.present();
  }

  private handleDelete(): void {
    let dispatcher;
    const { origin } = this.taskParams;

    if (origin === 'ProjectPage') {
      dispatcher = deleteTaskFromProject;
    } else if (origin === 'ActivityPage') {
      dispatcher = deleteTaskFromActivity;
    } else if (origin === 'TasksByDatePage') {
      dispatcher = deleteTaskLayoutDueDate;
    } else if (origin === 'TasksByProjectsPage') {
      dispatcher = deleteTaskLayoutProject;
    }

    this.store.dispatch(dispatcher(this.taskParams));
  }

  private get taskParams(): TaskParams {
    return this.viewCtrl.getNavParams().get('taskParams');
  }

  private get taskLink(): string {
    return `https://app.breeze.pm/cards/${this.task.id}`;
  }

  private get currentUser(): User {
    return this.viewCtrl.getNavParams().get('currentUser');
  }

  private get task(): Task {
    return this.viewCtrl.getNavParams().get('task');
  }
}
