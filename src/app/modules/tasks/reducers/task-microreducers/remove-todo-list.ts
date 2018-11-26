import {
  find, propOr, evolve, reject, propEq, prop, head,
  sum, partition, map, length, flip, subtract, identity,
} from 'ramda';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { Task, TaskTodoListParams, TodoList, Todo } from './../../../../models/tasks/task.model';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { mergeWithBaseItem, getTask, getTasksList, checkListLayout } from './../../utils/utils-reducers';
import { updateState } from '../../../../actions-utils';
import {
  DashboardLayout,
  REMOVE_TODO_LIST,
  REMOVE_TODO_LIST_SUCCESS,
  REMOVE_TODO_LIST_ERROR,
} from './../../actions/task.actions';

const removeTodoListReducer: TaskReducer = (state, _) =>
  updateState(state, 'removeTodoList', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const removeTodoListSuccessReducer: TaskReducer = (state, action) => {
  const params = prop<TaskTodoListParams>('payload', action);

  const tasksList = getTasksList(state);

  const task = getTask(state);

  const todoLists = prop<TodoList[]>('todo_lists', task);

  const todoList = find<TodoList>(propEq('id', params.listId), todoLists);

  const todos = propOr<Todo[], TodoList, Todo[]>([], 'todos', todoList);

  const doneAndNotDoneCount = map(length, partition(prop('done'), todos));

  const subtractTodosCount = flip(subtract)(sum(doneAndNotDoneCount));

  const subtractDoneCount = flip(subtract)(head(doneAndNotDoneCount));

  const whenProjectIdMatches = mapWhenPropsEq({ 'project_id': params.projectId });

  const whenStageIdMatches = mapWhenPropsEq({ 'stage_id': params.stageId });

  const whenTaskIdMatches = mapWhenPropsEq({ 'id': params.taskId });

  const whenDueDateBlockMatches = mapWhenPropsEq({ 'duedate_block': params.dueDateBlock });

  const updateTodoLists = evolve<Task>({
    'todos_count': subtractTodosCount,
    'done_todos': subtractDoneCount,
    'todo_lists': reject(propEq('id', params.listId)),
  });

  const updateTasks = evolve({
    'cards': whenTaskIdMatches(updateTodoLists),
  });

  const checkLayout: (v: DashboardLayout ) => boolean = checkListLayout(tasksList);

  let tasksListUpdater;

  const isLayoutByProject = checkLayout('project');

  const isLayoutByDueDate = checkLayout('duedate');

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

  const newFetchDashboardCards = updateState(state, 'fetchDashboardCards', mergeWithBaseItem({
    value: tasksListUpdater(tasksList),
  }));

  const newFetchedTask = updateState(newFetchDashboardCards, 'fetchTask', mergeWithBaseItem({
    value: updateTodoLists(task),
  }));

  return updateState(newFetchedTask, 'removeTodoList', mergeWithBaseItem({}));
};

const removeTodoListErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'removeTodoList', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

export const removeTodoListReducerSlice = {
  [REMOVE_TODO_LIST]: removeTodoListReducer,
  [REMOVE_TODO_LIST_SUCCESS]: removeTodoListSuccessReducer,
  [REMOVE_TODO_LIST_ERROR]: removeTodoListErrorReducer,
};
