import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { ADD_TIME_ENTRY, ADD_TIME_ENTRY_ERROR, ADD_TIME_ENTRY_SUCCESS } from '../../actions/task.actions';
import { add, assoc, evolve, prepend } from 'ramda';
import { mapWhenPropsEq } from '../../../../helpers/map-when-props-eq';
import { TimeEntryParams } from '../../../../models/tasks/task.model';
import { getTasksList, mergeWithBaseItem } from '../../utils/utils-reducers';

const addTimeEntryReducer: TaskReducer = (state, _) =>
  updateState(state, 'addTimeEntry', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const addTimeEntrySuccessReducer: TaskReducer = (state, action) => {
  let tasksListUpdater;
  const requestPayload: TimeEntryParams = action.payload.params;
  const responsePayload: any = action.payload.response;
  const currentTask = state.fetchTask.value;

  const layoutIsByProject: boolean = state.fetchDashboardCardsByProject.success;
  const layoutIsByDueDate: boolean = state.fetchDashboardCardsByDueDate.success;

  const whenProjectIdMatches = mapWhenPropsEq({ 'project_id': requestPayload.projectId });
  const whenStageIdMatches = mapWhenPropsEq({ 'stage_id': currentTask.stage_id });
  const whenTaskIdMatches = mapWhenPropsEq({ 'id': requestPayload.taskId });
  const whenDueDateBlockMatches = mapWhenPropsEq({ 'duedate_block': currentTask.duedate_block });

  const updatedTrackedTime = assoc('total_tracked', currentTask.total_tracked + requestPayload.tracked);

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
    'time_entries': prepend(responsePayload),
    'total_tracked': add(requestPayload.tracked),
  })(currentTask);

  const newFetchTaskState = updateState(newTasksList, 'fetchTask', mergeWithBaseItem({
    value: updatedTask,
  }));

  return updateState(newFetchTaskState, 'addTimeEntry', mergeWithBaseItem({}));
};

const addTimeEntryErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'addTimeEntry', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

export const addTimeEntryReducerSlice = {
  [ADD_TIME_ENTRY]: addTimeEntryReducer,
  [ADD_TIME_ENTRY_SUCCESS]: addTimeEntrySuccessReducer,
  [ADD_TIME_ENTRY_ERROR]: addTimeEntryErrorReducer,
};
