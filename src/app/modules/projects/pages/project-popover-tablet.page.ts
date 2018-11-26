import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';
import { EditProjectPage } from './edit-project.page';
import { AppState } from '../../../app.reducer';
import { Store } from '@ngrx/store';
import { addStage } from '../actions/project.actions';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { isDefined } from '../../../helpers/path-is-defined';

@Component({
  selector: 'project-popover-tablet',
  templateUrl: 'project-popover-tablet.page.html',
})
export class ProjectPopoverTablet {
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
}
