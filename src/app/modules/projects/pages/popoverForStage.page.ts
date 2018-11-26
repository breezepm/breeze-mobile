import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AppState } from '../../../app.reducer';
import { Store } from '@ngrx/store';
import { removeStage, StageLocator } from '../actions/project.actions';
import { isTablet } from '../../../helpers/is-tablet.ts';

@Component({
  selector: 'pop-over-for-stage',
  templateUrl: 'popoverForStage.page.html',
})
export class PopoverForStage {
  private projectId: number;
  private stageId: number;
  public isTablet: boolean = isTablet();

  constructor(
    private viewCtrl: ViewController,
    private store: Store<AppState>
  ) { }

  public ionViewWillEnter(): void {
    this.projectId = this.viewCtrl.data.projectId;
    this.stageId = this.viewCtrl.data.stageId;
  }

  public deleteStage(): void {
    const stageLocator: StageLocator = { projectId: this.projectId, stageId: this.stageId };
    if (this.projectId != null && this.stageId != null) {
      this.store.dispatch(removeStage(stageLocator));
    }
    this.viewCtrl.dismiss();
  }

}
