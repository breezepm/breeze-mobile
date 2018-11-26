import { evolve, prepend, identity, reject, propEq, compose, uniqBy, prop, always } from 'ramda';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { getTasksList, mergeWithBaseItem } from './../../utils/utils-reducers';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import {
  UpdateStageParams,
  UPDATE_STAGE,
  UPDATE_STAGE_SUCCESS,
  UPDATE_STAGE_ERROR,
} from './../../actions/task.actions';

const updateStageReducer: TaskReducer = (state, _) =>
  updateState(state, 'updateStage', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const updateStageSuccessReducer: TaskReducer = (state, action) => {
  const { task, params } = action.payload as UpdateStageParams;

  const whenProjectIdMatches = mapWhenPropsEq({ 'project_id': params.projectId });

  const whenPrevStageIdMatches = mapWhenPropsEq({ 'stage_id': params.stageId });

  const whenNewStageIdMatches = mapWhenPropsEq({ 'stage_id': task.stage_id });

  const removeTaskFromPrevStage = whenPrevStageIdMatches(evolve({
    'cards': reject(propEq('id', task.id)),
  }));

  const addTaskToNewStage = whenNewStageIdMatches(evolve({
    'cards': compose(uniqBy(prop('id')) , prepend(task)),
  }));

  const updateTasksListByProject = whenProjectIdMatches(evolve({
    'stages': compose(removeTaskFromPrevStage, addTaskToNewStage),
  }));

  const whenDueDateBlockMatches = mapWhenPropsEq({ 'duedate_block': params.dueDateBlock });

  const updateTasksListByDueDate = whenDueDateBlockMatches(evolve({
    'cards': mapWhenPropsEq({ 'id': task.id }, always(task)),
  }));

  let updaterFn = identity;

  const cameFromActivity = params.origin === 'ActivityPage';
  const cameFromTasksByProject = params.origin === 'TasksByProjectsPage';
  const cameFromTasksByDueDate = params.origin === 'TasksByDatePage';

  if (cameFromTasksByProject || (cameFromActivity && state.fetchDashboardCardsByProject.success)) {
    updaterFn = updateTasksListByProject;
  }

  if (cameFromTasksByDueDate || (cameFromActivity && state.fetchDashboardCardsByDueDate.success)) {
    updaterFn = updateTasksListByDueDate;
  }

  const newFetchDashboardCards = updateState(state, 'fetchDashboardCards', mergeWithBaseItem({
    value: updaterFn(getTasksList(state)),
  }));

  const newFetchTaskState = updateState(newFetchDashboardCards, 'fetchTask', mergeWithBaseItem({
    value: task,
  }));

  return updateState(newFetchTaskState, 'updateStage', mergeWithBaseItem({}));
};

const updateStageErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'updateStage', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

export const updateStageReducerSlice = {
  [UPDATE_STAGE]: updateStageReducer,
  [UPDATE_STAGE_SUCCESS]: updateStageSuccessReducer,
  [UPDATE_STAGE_ERROR]: updateStageErrorReducer,
};
