import { Task } from './../../../../models/tasks/task.model';
import { evolve, merge, prop, pick, flip } from 'ramda';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { getTasksList, mergeWithBaseItem, checkListLayout } from './../../utils/utils-reducers';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import {
  DashboardLayout,
  UPDATE_DESCRIPTION,
  UPDATE_DESCRIPTION_SUCCESS,
  UPDATE_DESCRIPTION_ERROR,
} from './../../actions/task.actions';

const updateDescriptionReducer: TaskReducer = (state, _) =>
  updateState(state, 'updateDescription', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const updateDescriptionSuccessReducer: TaskReducer = (state, action) => {
  let tasksListUpdater;

  const task = prop<Task>('payload', action);

  const tasksList = getTasksList(state);

  const isLayoutBy: (v: DashboardLayout) => boolean = checkListLayout(tasksList);

  const isLayoutByProject = isLayoutBy('project');

  const isLayoutByDueDate = isLayoutBy('duedate');

  const pickFromTask = flip(pick)(task);

  const updatedFields = pickFromTask(['description', 'updated_at']);

  const whenProjectIdMatches = mapWhenPropsEq(pickFromTask(['project_id']));

  const whenStageIdMatches = mapWhenPropsEq(pickFromTask(['stage_id']));

  const whenTaskIdMatches = mapWhenPropsEq(pickFromTask(['id']));

  const whenDueDateBlockMatches = mapWhenPropsEq(pickFromTask(['duedate_block']));

  const updateTasks = evolve({
    'cards': whenTaskIdMatches(flip(merge)(updatedFields)),
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

  const newTasksState = updateState(state, 'fetchDashboardCards', mergeWithBaseItem({
    value: tasksListUpdater(tasksList),
  }));

  const newFetchTaskState = updateState(newTasksState, 'fetchTask', mergeWithBaseItem({
    value: task,
  }));

  return updateState(newFetchTaskState, 'updateDescription', mergeWithBaseItem({}));
};

const updateDescriptionErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'updateDescription', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

export const updateDescriptionReducerSlice = {
  [UPDATE_DESCRIPTION]: updateDescriptionReducer,
  [UPDATE_DESCRIPTION_SUCCESS]: updateDescriptionSuccessReducer,
  [UPDATE_DESCRIPTION_ERROR]: updateDescriptionErrorReducer,
};
