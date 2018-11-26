import { Task } from './../../../../models/tasks/task.model';
import { evolve, always, prop, pick, flip } from 'ramda';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { getTasksList, mergeWithBaseItem, checkListLayout } from './../../utils/utils-reducers';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { DashboardLayout, UPDATE_NAME, UPDATE_NAME_SUCCESS, UPDATE_NAME_ERROR } from './../../actions/task.actions';

const updateNameReducer: TaskReducer = (state, _) =>
  updateState(state, 'updateName', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const updateNameSuccessReducer: TaskReducer = (state, action) => {
  let tasksListUpdater;

  const task = prop<Task>('payload', action);

  const tasksList = getTasksList(state);

  const isLayoutBy: (v: DashboardLayout) => boolean = checkListLayout(tasksList);

  const isLayoutByProject = isLayoutBy('project');

  const isLayoutByDueDate = isLayoutBy('duedate');

  const pickFromTask = flip(pick)(task);

  const whenProjectIdMatches = mapWhenPropsEq(pickFromTask(['project_id']));
  const whenStageIdMatches = mapWhenPropsEq(pickFromTask(['stage_id']));
  const whenTaskIdMatches = mapWhenPropsEq(pickFromTask(['id']));
  const whenDueDateBlockMatches = mapWhenPropsEq(pickFromTask(['duedate_block']));
  const updateTasks = evolve({
    'cards': whenTaskIdMatches(always(task)),
  });

  const updateTasksListByDueDate = whenDueDateBlockMatches(updateTasks);
  const updateTasksListByProject = whenProjectIdMatches(evolve({
    'stages': whenStageIdMatches(updateTasks),
  }));

  if (isLayoutByProject) {
    tasksListUpdater = updateTasksListByProject;
  }

  if (isLayoutByDueDate) {
    tasksListUpdater = updateTasksListByDueDate;
  }

  const newTasksList = updateState(state, 'fetchDashboardCards', mergeWithBaseItem({
    value: tasksListUpdater(getTasksList(state)),
  }));

  const newFetchTaskState = updateState(newTasksList, 'fetchTask', mergeWithBaseItem({
    value: task,
  }));

  return updateState(newFetchTaskState, 'updateName', mergeWithBaseItem({}));
};

const updateNameErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'updateName', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

export const updateNameReducerSlice = {
  [UPDATE_NAME]: updateNameReducer,
  [UPDATE_NAME_SUCCESS]: updateNameSuccessReducer,
  [UPDATE_NAME_ERROR]: updateNameErrorReducer,
};
