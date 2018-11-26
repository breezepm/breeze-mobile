import { ActionReducer, combineReducers, Action } from '@ngrx/store';

import { userReducer, UserState } from './modules/user/reducers/user.reducer';
import { projectReducer, ProjectState } from './modules/projects/reducers/project.reducer';
import { appRunReducer, AppRunState } from './shared/app-run/reducers/app-run.reducer';
import { activityReducer, ActivityState } from './modules/activity/reducers/activity.reducer';
import { notificationReducer, NotificationState } from './modules/activity/reducers/notifications.reducer';
import { taskReducer, TaskState } from './modules/tasks/reducers/task.reducer';
import { taskCommentReducer, TaskCommentState } from './modules/tasks/reducers/task-comment.reducer';
import { searchReducer, SearchState } from './modules/search/reducers/search.reducer';

export const reducers = {
  user: userReducer,
  project: projectReducer,
  appRun: appRunReducer,
  activity: activityReducer,
  notification: notificationReducer,
  task: taskReducer,
  taskComment: taskCommentReducer,
  search: searchReducer,
};

export interface AppState {
  user: UserState;
  project: ProjectState;
  appRun: AppRunState;
  activity: ActivityState;
  notification: NotificationState;
  task: TaskState;
  taskComment: TaskCommentState;
  search: SearchState;
}

const reducer: ActionReducer<AppState> = combineReducers(reducers);

export function appReducer(state: AppState, action: Action) {
  return reducer(state, action);
}
