import { Task } from './../../../../models/tasks/task.model';
import { evolve, always } from 'ramda';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { getTasksList, mergeWithBaseItem } from './../../utils/utils-reducers';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { UPDATE_USERS, UPDATE_USERS_SUCCESS, UPDATE_USERS_ERROR } from './../../actions/task.actions';

const updateUsersReducer: TaskReducer = (state, _) =>
  updateState(state, 'updateUsers', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const updateUsersSuccessReducer: TaskReducer = (state, action) => {
  let tasksListUpdater;
  const task = action.payload as Task;

  const layoutIsByProject: boolean = state.fetchDashboardCardsByProject.success;
  const layoutIsByDueDate: boolean = state.fetchDashboardCardsByDueDate.success;

  const whenProjectIdMatches = mapWhenPropsEq({ 'project_id': task.project_id });
  const whenStageIdMatches = mapWhenPropsEq({ 'stage_id': task.stage_id });
  const whenTaskIdMatches = mapWhenPropsEq({ 'id': task.id });
  const whenDueDateBlockMatches = mapWhenPropsEq({ 'duedate_block': task.duedate_block });
  const updateTasks = evolve({
    'cards': whenTaskIdMatches(always(task)),
  });

  const updateTasksListByDueDate = whenDueDateBlockMatches(updateTasks);
  const updateTasksListByProject = whenProjectIdMatches(evolve({
    'stages': whenStageIdMatches(updateTasks),
  }));

  if (layoutIsByProject) {
    tasksListUpdater = updateTasksListByProject;
  }

  if (layoutIsByDueDate) {
    tasksListUpdater = updateTasksListByDueDate;
  }

  const newTasksList = updateState(state, 'fetchDashboardCards', mergeWithBaseItem({
    value: tasksListUpdater(getTasksList(state)),
  }));

  const newFetchTaskState = updateState(newTasksList, 'fetchTask', mergeWithBaseItem({
    value: task,
  }));

  return updateState(newFetchTaskState, 'updateUsers', mergeWithBaseItem({}));
};

const updateUsersErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'updateUsers', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

export const updateUsersReducerSlice = {
  [UPDATE_USERS]: updateUsersReducer,
  [UPDATE_USERS_SUCCESS]: updateUsersSuccessReducer,
  [UPDATE_USERS_ERROR]: updateUsersErrorReducer,
};
