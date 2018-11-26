import { assoc, evolve, prop } from 'ramda';
import { Task, TaskTodoListParams } from './../../../../models/tasks/task.model';
import { mergeWithBaseItem, getTask } from './../../utils/utils-reducers';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { mapWhenPropsEq } from './../../../../helpers/map-when-props-eq';
import { EDIT_TODO_LIST, EDIT_TODO_LIST_SUCCESS, EDIT_TODO_LIST_ERROR } from './../../actions/task.actions';

const editTodoListReducer: TaskReducer = (state, _) =>
  updateState(state, 'editTodoList', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const editTodoListSuccessReducer: TaskReducer = (state, action) => {
  const params = prop<TaskTodoListParams>('payload', action);

  const task = getTask(state);

  const updateTodoLists = evolve<Task>({
    'todo_lists': mapWhenPropsEq({ 'id': params.listId }, assoc('name', params.name)),
  });

  const newFetchedTask = updateState(state, 'fetchTask', mergeWithBaseItem({
    value: updateTodoLists(task),
  }));

  return updateState(newFetchedTask, 'editTodoList', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
  });
};

const editTodoListErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'editTodoList', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

export const editTodoListReducerSlice = {
  [EDIT_TODO_LIST]: editTodoListReducer,
  [EDIT_TODO_LIST_SUCCESS]: editTodoListSuccessReducer,
  [EDIT_TODO_LIST_ERROR]: editTodoListErrorReducer,
};
