import { Component } from '@angular/core';
import { NavController, ViewController, Keyboard } from 'ionic-angular';
import { AppState } from '../../../app.reducer';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { ProjectData, removeProjectsInvitee, updateProject, updateProjectsInvitee } from '../actions/project.actions';
import { Subject } from 'rxjs/';
import { Board } from '../../../models/projects/board.model';
import { Observable } from 'rxjs/Observable';
import { clone, path } from 'ramda';
import { ProjectsPage } from './projects.page';
import { convertUserColorToHex } from '../../../helpers/convert-user-color-to-hex';
import { ProjectDetails } from './../../../models/projects/project-details.model';
import { isEnterOrNotKeyboardEvent } from '../../../helpers/is-enter-or-not-keyboard-event';

@Component({
  selector: 'edit-project-page',
  templateUrl: 'edit-project.page.html',
})
export class EditProjectPage {
  public workspaces: string[];
  public selectedWorkspaceId: number | string;
  public filters: any;

  private project$: Observable<ProjectDetails>;
  private projectName: string;
  private currentProject: ProjectDetails;
  private killer$: Subject<null> = new Subject();
  private projectUsers: any[];
  private currentUser: any;

  constructor(public viewCtrl: ViewController,
              public navCtrl: NavController,
              public store: Store<AppState>,
              private keyboard: Keyboard
            ) {}

  public ionViewWillEnter() {
    this.fetchCurrentProjectFromStore();
    this.fetchProjectGroupsFromStore();
    this.fetchCurrentUserFromStore();
  }

  public ionViewWillLeave() {
    this.killer$.next();
  }

  public updateProject(evt) {
    if (isEnterOrNotKeyboardEvent(evt)) {
      const payload: ProjectData = {
        name: this.projectName || '',
        workspace_id: this.selectedWorkspaceId,
        id: this.currentProject.id,
      };
      this.store.dispatch(updateProject(payload));
      this.keyboard.close();
    }
  }

  public setFilters(attr: any, event: any): void {
    const clearSearchPressed = event.target.className === 'button-inner';
    const filterValue = clearSearchPressed ? '' : event.target.value;
    this.filters = { [attr]: filterValue };
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public onUserSelect(user: any) {
    if (!user.assigned) {
      const payload = {
        userId: user.id,
        projectId: this.currentProject.id,
      };
      this.store.dispatch(removeProjectsInvitee(payload));

      if (user.id === this.currentUser.id) {
        this.navCtrl.push(ProjectsPage);
      }
    } else {
      const payload: ProjectData = {
        id: this.currentProject.id,
        invitees: user.email,
      };
      this.store.dispatch(updateProjectsInvitee(payload));
    }
  }

  private fetchProjectGroupsFromStore() {
    const board$: Observable<Board[]> = this.selectFromStore<Board[]>('project', 'fetchProjects', 'value');
    board$
      .filter((boards: Board[]) => path(['workspaces', 'length'], boards[0]) > 0)
      .takeUntil(this.killer$)
      .subscribe((boards: Board[]) => {
        this.workspaces = boards[0].workspaces;
      });
  }

  private fetchCurrentProjectFromStore() {
    this.project$ = this.selectFromStore<ProjectDetails>('project', 'fetchProject', 'value');
    this.project$
      .first()
      .subscribe((res) => {
        this.currentProject = clone(res);
        this.projectName = res.name;
        this.selectedWorkspaceId = res.workspace_id;
        this.projectUsers = res.users;
        this.modifyUsersArray();
      });
  }

  private fetchCurrentUserFromStore() {
    this.selectFromStore('user', 'fetchCurrentUser', 'value')
      .map(convertUserColorToHex)
      .takeUntil(this.killer$)
      .subscribe((user: any) => this.currentUser = user);
  }

  private modifyUsersArray() {
    this.projectUsers = this.currentProject.users.map(convertUserColorToHex);
  }

  private selectFromStore <T>(...route: string[]): Observable<T> {
    return this.store.select<T>(...route)
      .filter(v => v != null);
  }
}
