import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AppState } from '../../../app.reducer';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { createProject, ProjectData } from '../actions/project.actions';
import { Subject } from 'rxjs/';
import { Board } from '../../../models/projects/board.model';
import { Observable } from 'rxjs/Observable';
import { convertUserColorToHex } from '../../../helpers/convert-user-color-to-hex';
import { compose, map, propEq, reject, path } from 'ramda';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomValidators } from '../../../shared/form/validators/custom-validators';
import { isEnterOrNotKeyboardEvent } from '../../../helpers/is-enter-or-not-keyboard-event';

@Component({
  selector: 'add-new-project-page',
  templateUrl: 'add-new-project.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewProjectPage {
  public form: FormGroup;
  public workspaces: string[];
  public selectedWorkspace: any;

  private board$: Observable<Board[]>;
  private currentUserId: number;
  private users: any[];
  private filters: any;
  private invitees: any[] = [];
  private killer$: Subject<null> = new Subject();

  constructor(
    private fb: FormBuilder,
    private viewCtrl: ViewController,
    private store: Store<AppState>,
    private detector: ChangeDetectorRef
  ) {}

  public ionViewWillEnter() {
    this.fetchCurrentUserFromStore();
    this.fetchTeamUsersFromStore();
    this.fetchProjectsFromStore();
  }

  public ngOnInit(): void {
    this.createForm();
  }

  public ionViewWillLeave() {
    this.killer$.next();
  }

  public createProject(evt) {
    if (isEnterOrNotKeyboardEvent(evt) && this.form.valid) {
      const projectData: ProjectData = {
        name: this.form.get('projectName').value,
        invitees: this.invitees,
        workspace_id: this.selectedWorkspace || null,
      };
      this.store.dispatch(createProject(projectData));
      this.viewCtrl.dismiss();
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
    if (user.selected && !this.invitees.includes(user.email)) {
      this.invitees = this.invitees.concat([user.email]);
    } else if (!user.selected && this.invitees.includes(user.email)) {
      this.invitees = this.invitees.filter(item => item !== user.email);
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      projectName: [ '', CustomValidators.required('Project name') ],
    });
  }

  private setUsers(users: any[]): void {
    this.users = users;
    this.detector.markForCheck();
  }

  private fetchTeamUsersFromStore() {
    const filterCurrentUserAndFixColor = compose(
      map(convertUserColorToHex),
      reject(propEq('id', this.currentUserId))
    );

    this.store.select('user', 'fetchTeamUsers', 'value')
      .map(filterCurrentUserAndFixColor)
      .first()
      .subscribe(this.setUsers.bind(this));
  }

  private fetchCurrentUserFromStore() {
    this.selectFromStore('user', 'fetchCurrentUser', 'value')
      .map(convertUserColorToHex)
      .takeUntil(this.killer$)
      .subscribe((user: any) => {
        this.currentUserId = user.id;
        this.detector.markForCheck();
      });
  }

  private fetchProjectsFromStore() {
    this.board$ = this.selectFromStore<Board[]>('project', 'fetchProjects', 'value');
    this.board$
      .filter((boards: Board[]) => path(['workspaces', 'length'], boards[0]) > 0)
      .takeUntil(this.killer$)
      .subscribe((boards: Board[]) => {
        this.workspaces = boards[0].workspaces;
        this.detector.markForCheck();
      });
  }

  private selectFromStore <T>(...route: string[]): Observable<T> {
    return this.store.select<T>(...route)
      .filter(v => v != null);
  }
}
