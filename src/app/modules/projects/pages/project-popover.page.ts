import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';
import { EditProjectPage } from './edit-project.page';
import { AppState } from '../../../app.reducer';
import { Store } from '@ngrx/store';
import { addStage, removeStage, StageLocator } from '../actions/project.actions';

@Component({
  selector: 'page-project-popover',
  templateUrl: 'project-popover.page.html',
})
export class ProjectPopoverPage {
  private projectId: number;
  private stageId: number;

  constructor(
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private store: Store<AppState>
  ) { }

  public ionViewWillEnter(): void {
    this.projectId = this.viewCtrl.data.projectId;
    this.stageId = this.viewCtrl.data.stageId;
  }

  public projectSetting(): void {
    const modal = this.modalCtrl.create(EditProjectPage);
    modal.present();
    this.viewCtrl.dismiss();
  }

  public addStage(): void {
    this.store.dispatch(addStage(this.projectId));
    this.viewCtrl.dismiss();
  }

  public deleteStage(): void {
    const stageLocator: StageLocator = { projectId: this.projectId, stageId: this.stageId };
    if (this.projectId != null && this.stageId != null) {
      this.store.dispatch(removeStage(stageLocator));
    }
    this.viewCtrl.dismiss();
  }
}
