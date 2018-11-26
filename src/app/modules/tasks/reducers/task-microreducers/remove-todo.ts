import { identity, prop, dec, evolve, propEq, reject } from 'ramda';
import { mergeWithBaseItem, getTask, getTasksList, checkListLayout } from './../../utils/utils-reducers';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { updateState } from '../../../../actions-utils';
import { TaskTodoParams, Todo } from './../../../../models/tasks/task.model';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { DashboardLayout, REMOVE_TODO, REMOVE_TODO_SUCCESS, REMOVE_TODO_ERROR } from './../../actions/task.actions';

const removeTodoReducer: TaskReducer = (state, _) =>
  updateState(state, 'removeTodo', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const removeTodoSuccessReducer: TaskReducer = (state, action) => {
  let tasksListUpdater;

  let doneCountUpdater;

  const params = prop<TaskTodoParams>('payload', action);

  const todo = prop<Todo>('todo', params);

  const task = getTask(state);

  const tasksList = getTasksList(state);

  const checkLayout: (v: DashboardLayout) => boolean = checkListLayout(tasksList);

  const isLayoutByProject = checkLayout('project');

  const isLayoutByDueDate = checkLayout('duedate');

  const whenProjectIdMatches = mapWhenPropsEq({ 'project_id': params.projectId });

  const whenStageIdMatches = mapWhenPropsEq({ 'stage_id': params.stageId });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': params.taskId });

  const whenTodoListIdMatches = mapWhenPropsEq({ 'id': params.listId });

  const whenDueDateBlockMatches = mapWhenPropsEq({ 'duedate_block': params.dueDateBlock });

  if (todo.done) {
    doneCountUpdater = dec;
  }

  doneCountUpdater = doneCountUpdater || identity;

  const rejectCurrentTodo = evolve({
    'todos': reject(propEq('id', params.todoId)),
  });

  const updateTodoListInTask = evolve({
    'todo_lists': whenTodoListIdMatches(rejectCurrentTodo),
    'done_todos': doneCountUpdater,
    'todos_count': dec,
  });

  const updateTasks = evolve({
    'cards': whenTaskIdMatches(evolve({
      'done_todos': doneCountUpdater,
      'todos_count': dec,
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

  return updateState(newTasksList, 'removeTodo', mergeWithBaseItem({}));
};

const removeTodoErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'removeTodo', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

export const removeTodoReducerSlice = {
  [REMOVE_TODO]: removeTodoReducer,
  [REMOVE_TODO_SUCCESS]: removeTodoSuccessReducer,
  [REMOVE_TODO_ERROR]: removeTodoErrorReducer,
};
