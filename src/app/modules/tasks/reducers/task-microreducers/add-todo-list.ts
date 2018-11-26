import { compose, evolve, filter, has, prepend, prop } from 'ramda';
import { TaskReducer, TaskStateItem } from '../task.reducer';
import { Task, TaskTodoListParams } from './../../../../models/tasks/task.model';
import { updateState } from '../../../../actions-utils';
import { getTask, mergeWithBaseItem } from './../../utils/utils-reducers';
import { ADD_TODO_LIST, ADD_TODO_LIST_SUCCESS, ADD_TODO_LIST_ERROR } from './../../actions/task.actions';

const addTodoListReducer: TaskReducer = (state, _) =>
  updateState(state, 'addTodoList', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
  });

const addTodoListSuccessReducer: TaskReducer = (state, action) => {
  const params = prop<TaskTodoListParams>('payload', action);

  const task = getTask(state);

  const updateTodoLists = evolve<Task>({
    'todo_lists': compose(prepend(params), filter(has('id'))),
  });

  const newFetchedTask = updateState(state, 'fetchTask', mergeWithBaseItem({
    value: updateTodoLists(task),
  }));

  return updateState(newFetchedTask, 'addTodoList', mergeWithBaseItem({}));
};

const addTodoListErrorReducer: TaskReducer = (state, action) =>
  updateState(state, 'addTodoList', <TaskStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
  });

export const addTodoListReducerSlice = {
  [ADD_TODO_LIST]: addTodoListReducer,
  [ADD_TODO_LIST_SUCCESS]: addTodoListSuccessReducer,
  [ADD_TODO_LIST_ERROR]: addTodoListErrorReducer,
};
