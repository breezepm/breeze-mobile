import { evolve, prepend, inc } from 'ramda';
import { Task } from './../../../../models/tasks/task.model';
import { TaskAttachment } from './../../../../models/task-comment/task-comment.model';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { getTasksList, checkListLayout, mergeWithBaseItem } from './../../utils/utils-reducers';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import {
  ADD_ATTACHMENT,
  ADD_ATTACHMENT_SUCCESS,
  ADD_ATTACHMENT_ERROR,
  DashboardLayout,
} from './../../actions/task.actions';

const addAttachmentReducer: TaskReducer = (state, action) =>
  updateState(state, 'addAttachment', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const addAttachmentSuccessReducer: TaskReducer = (state, action) => {
  const newAttachment = action.payload as TaskAttachment;

  const oldTask = state.fetchTask.value as Task;

  let tasksListUpdater;

  const tasksList = getTasksList(state);

  const isLayoutBy = checkListLayout(tasksList);

  const isLayoutByProject = isLayoutBy('project');

  const isLayoutByDueDate = isLayoutBy('duedate');

  const whenDueDateBlockMatches = mapWhenPropsEq({ 'duedate_block': newAttachment.dueDateBlock });

  const whenProjectIdMatches = mapWhenPropsEq({ 'project_id': newAttachment.project_id });

  const whenStageIdMatches = mapWhenPropsEq({ 'stage_id': newAttachment.stageId });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': newAttachment.card_id });

  const updateTask = evolve({
    'cards': whenTaskIdMatches(evolve({
      'attachments_count': inc,
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

  const prependAttachment = evolve<Task>({
    attachments_count: inc,
    attachments: prepend(newAttachment),
  });

  const newFetchTaskState = updateState(newTasksList, 'fetchTask', mergeWithBaseItem({
    value: prependAttachment(oldTask),
  }));

  return updateState(newFetchTaskState, 'addAttachment', mergeWithBaseItem({
    value: action.payload,
  }));
};

const addAttachmentErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'addAttachment', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

export const addAttachmentReducerSlice = {
  [ADD_ATTACHMENT]: addAttachmentReducer,
  [ADD_ATTACHMENT_SUCCESS]: addAttachmentSuccessReducer,
  [ADD_ATTACHMENT_ERROR]: addAttachmentErrorReducer,
};
