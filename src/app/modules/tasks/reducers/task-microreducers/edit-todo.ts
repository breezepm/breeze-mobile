import { evolve, identity, inc, dec, find, prop, propEq, flip, merge } from 'ramda';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { mergeWithBaseItem, getTask, getTasksList, checkListLayout } from './../../utils/utils-reducers';
import { updateState } from '../../../../actions-utils';
import { Task, TaskTodoParams, Todo, TodoList } from './../../../../models/tasks/task.model';
import { EDIT_TODO, EDIT_TODO_SUCCESS, EDIT_TODO_ERROR, DashboardLayout } from './../../actions/task.actions';

const editTodoReducer: TaskReducer = (state, _) =>
  updateState(state, 'editTodo', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const editTodoSuccessReducer: TaskReducer = (state, action) => {
  let tasksListUpdater;

  let doneCountUpdater;

  const params: TaskTodoParams  = action.payload;

  const todo = prop<Todo>('todo', params);

  const task = getTask(state);

  const tasksList = getTasksList(state);

  const todoList = find<TodoList>(propEq('id', params.listId), prop<TodoList[]>('todo_lists', task));

  const prevTodo = find<Todo>(propEq('id', params.todoId), prop<Todo[]>('todos', todoList));

  const checkLayout: (v: DashboardLayout) => boolean = checkListLayout(tasksList);

  const isLayoutByProject = checkLayout('project');

  const isLayoutByDueDate = checkLayout('duedate');

  const whenProjectIdMatches = mapWhenPropsEq({ 'project_id': params.projectId });

  const whenStageIdMatches = mapWhenPropsEq({ 'stage_id': params.stageId });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': params.taskId });

  const whenTodoListIdMatches = mapWhenPropsEq({ 'id': params.listId });

  const whenTodoIdMatches = mapWhenPropsEq({ 'id': params.todoId });

  const whenDueDateBlockMatches = mapWhenPropsEq({ 'duedate_block': params.dueDateBlock });

  if (!prevTodo.done && todo.done) {
    doneCountUpdater = inc;
  }

  if (prevTodo.done && !todo.done) {
    doneCountUpdater = dec;
  }

  doneCountUpdater = doneCountUpdater || identity;

  const updateTodo = flip(merge)(todo);

  const updateTodos = evolve({
    'todos': whenTodoIdMatches(updateTodo),
  });

  const updateTodoListInTask = evolve<Task>({
    'todo_lists': whenTodoListIdMatches(updateTodos),
    'done_todos': doneCountUpdater,
  });

  const updateTasks = evolve({
    'cards': whenTaskIdMatches(evolve({
      'done_todos': doneCountUpdater,
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

  return updateState(newTasksList, 'editTodo', mergeWithBaseItem({}));
};

const editTodoErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'editTodo', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

export const editTodoReducerSlice = {
  [EDIT_TODO]: editTodoReducer,
  [EDIT_TODO_SUCCESS]: editTodoSuccessReducer,
  [EDIT_TODO_ERROR]: editTodoErrorReducer,
};
