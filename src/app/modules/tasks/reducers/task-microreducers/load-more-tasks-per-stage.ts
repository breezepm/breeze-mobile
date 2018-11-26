import { evolve, flip, concat, inc, always } from 'ramda';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { getTasksList } from './../../utils/utils-reducers';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import {
  LOAD_MORE_TASKS_PER_STAGE,
  LOAD_MORE_TASKS_PER_STAGE_SUCCESS,
  LOAD_MORE_TASKS_PER_STAGE_ERROR,
} from './../../actions/task.actions';

const loadMoreTasksPerStageReducer: TaskReducer = (state, action) =>
  updateState(state, 'loadMoreTasksPerStage', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const loadMoreTasksPerStageSuccessReducer: TaskReducer = (state, action) => {
  const currentProjectId = state.loadMoreTasksPerStage.value.dashboardGroup.project_id;
  const currentStageId = state.loadMoreTasksPerStage.value.stageId;
  const currentTasksList = getTasksList(state);

  const updateTasksList = mapWhenPropsEq({ 'project_id': currentProjectId }, evolve({
    'stages': mapWhenPropsEq({ 'stage_id': currentStageId }, evolve({
      'next_page': always(action.payload[0].next_page),
      'cards': flip(concat)(action.payload[0].cards),
      'page': inc,
    })),
  }));

  const updatedFetchDashboardCards = updateState(state, 'fetchDashboardCards', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: updateTasksList(currentTasksList),
  });

  return updateState(updatedFetchDashboardCards, 'loadMoreTasksPerStage', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });
};

const loadMoreTasksPerStageErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'loadMoreTasksPerStage', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

export const loadMoreTasksPerStageReducerSlice = {
  [LOAD_MORE_TASKS_PER_STAGE]: loadMoreTasksPerStageReducer,
  [LOAD_MORE_TASKS_PER_STAGE_SUCCESS]: loadMoreTasksPerStageSuccessReducer,
  [LOAD_MORE_TASKS_PER_STAGE_ERROR]: loadMoreTasksPerStageErrorReducer,
};
