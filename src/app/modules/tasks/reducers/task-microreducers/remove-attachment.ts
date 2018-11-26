import { evolve, reject, propEq, dec } from 'ramda';
import { Task, TaskAttachmentParams } from './../../../../models/tasks/task.model';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { mergeWithBaseItem, getTasksList, checkListLayout } from './../../utils/utils-reducers';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { updateState } from '../../../../actions-utils';
import {
  REMOVE_ATTACHMENT,
  REMOVE_ATTACHMENT_SUCCESS,
  REMOVE_ATTACHMENT_ERROR,
  DashboardLayout,
} from './../../actions/task.actions';

const removeAttachmentReducer: TaskReducer = (state, action) =>
  updateState(state, 'removeAttachment', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const removeAttachmentSuccessReducer: TaskReducer = (state, action) => {
  const params = action.payload as TaskAttachmentParams;
  const oldTask = state.fetchTask.value as Task;

  let tasksListUpdater;

  const tasksList = getTasksList(state);

  const isLayoutBy: (v: DashboardLayout) => boolean = checkListLayout(tasksList);

  const isLayoutByProject = isLayoutBy('project');

  const isLayoutByDueDate = isLayoutBy('duedate');

  const whenDueDateBlockMatches = mapWhenPropsEq({ 'duedate_block': params.dueDateBlock });

  const whenProjectIdMatches = mapWhenPropsEq({ 'project_id': params.projectId });

  const whenStageIdMatches = mapWhenPropsEq({ 'stage_id': params.stageId });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': params.taskId });

  const updateTask = evolve({
    'cards': whenTaskIdMatches(evolve({
      'attachments_count': dec,
    })),
  });

  const updateTasksListByDueDate = whenDueDateBlockMatches(updateTask);
  const updateTasksListByProject = whenProjectIdMatches(evolve({
    'stages': whenStageIdMatches(updateTask),
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

  const filterAttachment = evolve<Task>({
    'attachments_count': dec,
    'attachments': reject(propEq('id', params.attachmentId)),
  });

  const newFetchTaskState = updateState(newTasksList, 'fetchTask', mergeWithBaseItem({
    'value': filterAttachment(oldTask),
  }));

  return updateState(newFetchTaskState, 'removeAttachment', mergeWithBaseItem({
    'value': action.payload,
  }));
};

const removeAttachmentErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'removeAttachment', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

export const removeAttachmentReducerSlice = {
  [REMOVE_ATTACHMENT]: removeAttachmentReducer,
  [REMOVE_ATTACHMENT_SUCCESS]: removeAttachmentSuccessReducer,
  [REMOVE_ATTACHMENT_ERROR]: removeAttachmentErrorReducer,
};
