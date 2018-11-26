import { always, concat, evolve, flip, inc } from 'ramda';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { getTasksList } from './../../utils/utils-reducers';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import {
  LOAD_MORE_TASKS_PER_DUE_DATE,
  LOAD_MORE_TASKS_PER_DUE_DATE_SUCCESS,
  LOAD_MORE_TASKS_PER_DUE_DATE_ERROR,
} from './../../actions/task.actions';

const loadMoreTasksPerDueDateReducer: TaskReducer = (state, action) =>
  updateState(state, 'loadMoreTasksPerDueDate', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const loadMoreTasksPerDueDateSuccessReducer: TaskReducer = (state, action) => {
  const currentDueDateBlock = state.loadMoreTasksPerDueDate.value.group;
  const currentTasksList = getTasksList(state);

  const updateTaskList = mapWhenPropsEq({ 'duedate_block': currentDueDateBlock }, evolve({
    'cards': flip(concat)(action.payload[0].cards),
    'next_page': always(action.payload[0].next_page),
    'page': inc,
  }));

  const updatedFetchDashboardCards = updateState(state, 'fetchDashboardCards', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: updateTaskList(currentTasksList),
  });

  return updateState(updatedFetchDashboardCards, 'loadMoreTasksPerDueDate', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });
};

const loadMoreTasksPerDueDateErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'loadMoreTasksPerDueDate', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

export const loadMoreTasksPerDueDateReducerSlice = {
  [LOAD_MORE_TASKS_PER_DUE_DATE]: loadMoreTasksPerDueDateReducer,
  [LOAD_MORE_TASKS_PER_DUE_DATE_SUCCESS]: loadMoreTasksPerDueDateSuccessReducer,
  [LOAD_MORE_TASKS_PER_DUE_DATE_ERROR]: loadMoreTasksPerDueDateErrorReducer,
};
