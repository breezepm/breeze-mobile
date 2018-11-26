import { append, inc, compose, evolve, filter, has, identity } from 'ramda';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { Task, TaskTodoParams, Todo } from './../../../../models/tasks/task.model';
import { updateState } from '../../../../actions-utils';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { getTask, mergeWithBaseItem, checkListLayout, getTasksList } from './../../utils/utils-reducers';
import { DashboardLayout, ADD_TODO, ADD_TODO_SUCCESS, ADD_TODO_ERROR } from './../../actions/task.actions';

const addTodoReducer: TaskReducer = (state, _) =>
  updateState(state, 'addTodo', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const addTodoSuccessReducer: TaskReducer = (state, action) => {
  let tasksListUpdater;

  const params = action.payload;

  const { stageId, dueDateBlock } = params;
  const projectId = (<TaskTodoParams> params).projectId || (<Todo> params).project_id;
  const taskId = (<TaskTodoParams> params).taskId || (<Todo> params).card_id;
  const listId = (<TaskTodoParams> params).listId || (<Todo> params).todo_list_id;

  const task = getTask(state);

  const tasksList = getTasksList(state);

  const checkLayout: (v: DashboardLayout ) => boolean = checkListLayout(tasksList);

  const isLayoutByProject = checkLayout('project');

  const isLayoutByDueDate = checkLayout('duedate');

  const whenProjectIdMatches = mapWhenPropsEq({ 'project_id': projectId });

  const whenStageIdMatches = mapWhenPropsEq({ 'stage_id': stageId });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': taskId });

  const whenTodoListIdMatches = mapWhenPropsEq({ 'id': listId });

  const whenDueDateBlockMatches = mapWhenPropsEq({ 'duedate_block': dueDateBlock });

  const updateTodos = whenTodoListIdMatches(evolve({
    'todos': compose(append(params), filter(has('id'))),
  }));

  const countUpdater = has('id', params) ? identity : inc;

  const updateTodoListInTask = evolve<Task>({
    'todo_lists': updateTodos,
    'todos_count': countUpdater,
  });

  const updateTasks = evolve({
    'cards': whenTaskIdMatches(evolve({
      'todos_count': countUpdater,
    })),
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

  tasksListUpdater = tasksListUpdater || identity;

  const newFetchTask = updateState(state, 'fetchTask', mergeWithBaseItem({
    value: updateTodoListInTask(task),
  }));

  const newTasksList = updateState(newFetchTask, 'fetchDashboardCards', mergeWithBaseItem({
    value: tasksListUpdater(tasksList),
  }));

  return updateState(newTasksList, 'addTodo', mergeWithBaseItem({}));
};

const addTodoErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'addTodo', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

export const addTodoReducerSlice = {
  [ADD_TODO]: addTodoReducer,
  [ADD_TODO_SUCCESS]: addTodoSuccessReducer,
  [ADD_TODO_ERROR]: addTodoErrorReducer,
};
