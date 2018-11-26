import { Task } from './../../../../models/tasks/task.model';
import { evolve, inc, dec, identity, prop, propEq } from 'ramda';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { getTasksList, mergeWithBaseItem, checkListLayout } from './../../utils/utils-reducers';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { DashboardLayout, UPDATE_COMMENTS_COUNT_ON_LIST } from './../../actions/task.actions';
import { TaskCommentParams } from './../../../projects/actions/project.actions';

const updateCommentsCountOnListReducer: TaskReducer = (state, action) => {
  let tasksListUpdater;

  let countUpdater;

  const params = prop<TaskCommentParams>('payload', action);

  const tasksList = getTasksList(state);

  const isLayoutBy = checkListLayout(tasksList);

  const isLayoutByProject = isLayoutBy('project');

  const isLayoutByDueDate = isLayoutBy('duedate');

  const whenProjectIdMatches = mapWhenPropsEq({ 'project_id': params.projectId });

  const whenStageIdMatches = mapWhenPropsEq({ 'stage_id': params.stageId });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': params.taskId });

  const whenDueDateBlockMatches = mapWhenPropsEq({ 'duedate_block': params.dueDateBlock });

  const typeEq = propEq('type');

  if (typeEq('add', params)) {
    countUpdater = inc;
  } else if (typeEq('remove', params)) {
    countUpdater = dec;
  } else {
    countUpdater = identity;
  }

  const updateTaskCommentsCount = evolve({
    'cards': whenTaskIdMatches(evolve({
      'comments_count': countUpdater,
    })),
  });

  const updateTasksListByDueDate = whenDueDateBlockMatches(updateTaskCommentsCount);

  const updateTasksListByProject = whenProjectIdMatches(evolve({
    'stages': whenStageIdMatches(updateTaskCommentsCount),
  }));

  if (isLayoutByProject) {
    tasksListUpdater = updateTasksListByProject;
  }

  if (isLayoutByDueDate) {
    tasksListUpdater = updateTasksListByDueDate;
  }

  return updateState(state, 'fetchDashboardCards', mergeWithBaseItem({
    value: tasksListUpdater(getTasksList(state)),
  }));
};

export const updateCommentsCountReducerSlice = {
  [UPDATE_COMMENTS_COUNT_ON_LIST]: updateCommentsCountOnListReducer,
};
