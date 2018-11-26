import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { REMOVE_TIME_ENTRY, REMOVE_TIME_ENTRY_ERROR, REMOVE_TIME_ENTRY_SUCCESS } from '../../actions/task.actions';
import { mapWhenPropsEq } from '../../../../helpers/map-when-props-eq';
import { assoc, evolve, flip, subtract, propEq, reject } from 'ramda';
import { getTasksList, mergeWithBaseItem } from '../../utils/utils-reducers';
import { TimeEntryParams } from '../../../../models/tasks/task.model';

const removeTimeEntryReducer: TaskReducer = (state, _) =>
  updateState(state, 'removeTimeEntry', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const removeTimeEntrySuccessReducer: TaskReducer = (state, action) => {
  let tasksListUpdater;
  const payload: TimeEntryParams = action.payload;
  const currentTask = state.fetchTask.value;

  const layoutIsByProject: boolean = state.fetchDashboardCardsByProject.success;
  const layoutIsByDueDate: boolean = state.fetchDashboardCardsByDueDate.success;

  const whenProjectIdMatches = mapWhenPropsEq({ 'project_id': payload.projectId });
  const whenStageIdMatches = mapWhenPropsEq({ 'stage_id': currentTask.stage_id });
  const whenTaskIdMatches = mapWhenPropsEq({ 'id': payload.taskId });
  const whenDueDateBlockMatches = mapWhenPropsEq({ 'duedate_block': currentTask.duedate_block });

  const updatedTrackedTime = assoc('total_tracked', currentTask.total_tracked - payload.tracked);

  const updateTasks = evolve({
    'cards': whenTaskIdMatches(updatedTrackedTime),
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

  const updatedTask = evolve({
    'time_entries': reject(propEq('id', payload.entryId)),
    'total_tracked': flip(subtract)(payload.tracked),
  })(currentTask);

  const newFetchTaskState = updateState(newTasksList, 'fetchTask', mergeWithBaseItem({
    value: updatedTask,
  }));

  return updateState(newFetchTaskState, 'removeTimeEntry', mergeWithBaseItem({}));
};

const removeTimeEntryErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'removeTimeEntry', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

export const removeTimeEntryReducerSlice = {
  [REMOVE_TIME_ENTRY]: removeTimeEntryReducer,
  [REMOVE_TIME_ENTRY_SUCCESS]: removeTimeEntrySuccessReducer,
  [REMOVE_TIME_ENTRY_ERROR]: removeTimeEntryErrorReducer,
};
