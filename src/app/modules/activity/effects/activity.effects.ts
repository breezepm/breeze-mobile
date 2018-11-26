import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import {
  Activity, ActivityAction, FETCH_ACTIVITIES, fetchActivitiesError, fetchActivitiesSuccess,
  FetchActivitiesSuccess, LOAD_MORE_ACTIVITIES, loadMoreActivitiesError, LoadMoreActivitiesSuccess,
  loadMoreActivitiesSuccess, ParamsModel, DELETE_TASK_FROM_ACTIVITY, DeleteTaskFromActivity,
  DeleteTaskFromActivitySuccess, deleteTaskFromActivitySuccess, deleteTaskFromActivityError,
  DEFAULT,
} from '../actions/activity.actions';
import { TaskParams } from './../../tasks/actions/task.actions';
import { HttpInterceptor, ServerError } from '../../../providers/http.interceptor';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ActivityEffects {

  @Effect() public fetchActivities$ = this.actions$
    .ofType(FETCH_ACTIVITIES)
    .switchMap(this.fetchActivities.bind(this));

  @Effect() public loadMoreActivities$ = this.actions$
    .ofType(LOAD_MORE_ACTIVITIES)
    .map(toPayload)
    .switchMap(this.loadMoreActivities.bind(this));

  @Effect() public deleteTaskFromActivity$ = this.actions$
    .ofType(DELETE_TASK_FROM_ACTIVITY)
    .map<DeleteTaskFromActivity, TaskParams>(toPayload)
    .switchMap(this.deleteTaskFromActivity.bind(this));

  constructor(private actions$: Actions, private http: HttpInterceptor) {}

  private fetchActivities(): Observable<ActivityAction> {
    return this.http.get<Activity[]>('/activities')
      .map<Activity[], FetchActivitiesSuccess>(fetchActivitiesSuccess)
      .catch((error: ServerError) => Observable.of(fetchActivitiesError(error)));
  }

  private loadMoreActivities(payload: ParamsModel): Observable<ActivityAction> {
    if (payload.page === 1) {
      return Observable.of({ type: DEFAULT });
    }

    return this.http.get('/activities', { params: { page: payload.page } })
      .map<Activity[], LoadMoreActivitiesSuccess>(loadMoreActivitiesSuccess)
      .catch((error: ServerError) => Observable.of(loadMoreActivitiesError(error)));
  }

  private deleteTaskFromActivity(taskParams: TaskParams) {
    return this.http.delete(`/projects/${taskParams.projectId}/cards/${taskParams.taskId}`)
      .map<any, DeleteTaskFromActivitySuccess>(() => deleteTaskFromActivitySuccess(taskParams))
      .catch((error: ServerError) => Observable.of(deleteTaskFromActivityError(error)));
  }
}
