import {
  addAttachmentReducerSlice, addTodoListReducerSlice, addTodoReducerSlice,
  deleteTaskLayoutDueDateReducerSlice, deleteTaskLayoutProjectReducerSlice,
  editTodoListReducerSlice, editTodoReducerSlice, fetchDashboardCardsByDueDateReducerSlice,
  fetchDashboardCardsByProjectReducerSlice, fetchDashboardCardsReducerSlice,
  fetchDashboardUsersReducerSlice, fetchTaskReducerSlice, loadMoreDashboardCardsReducerSlice,
  loadMoreTasksPerDueDateReducerSlice, loadMoreTasksPerStageReducerSlice,
  removeAttachmentReducerSlice, removeTodoListReducerSlice, removeTodoReducerSlice,
  savePopoverStateReducerSlice, updateStageReducerSlice, updateStatusReducerSlice,
  updateDatesReducerSlice, updateUsersReducerSlice, updateNameReducerSlice,
  updateDescriptionReducerSlice, updateCommentsCountReducerSlice,
} from './task-microreducers';
import { TaskAction, DEFAULT } from '../actions/task.actions';
import { Reducer } from '../../../actions-utils';
import { mergeAll } from 'ramda';
import { removeTimeEntryReducerSlice } from './task-microreducers/remove-time-entry';
import { addTimeEntryReducerSlice } from './task-microreducers/add-time-entry';
import { fetchWidgetsReducerSlice } from './task-microreducers/fetch-widgets';
import { addNewTaskToWidgetsSlice } from './task-microreducers/add-new-task-to-widgets';

export interface TaskStateItem {
  error: boolean;
  errorData: any;
  pending: boolean;
  success: boolean;
  value?: any;
}

export interface TaskState {
  deleteTaskLayoutDueDate: TaskStateItem;
  deleteTaskLayoutProject: TaskStateItem;
  fetchDashboardCards: TaskStateItem;
  fetchDashboardCardsByProject: TaskStateItem;
  fetchDashboardCardsByDueDate: TaskStateItem;
  fetchDashboardUsers: TaskStateItem;
  fetchTask: TaskStateItem;
  loadMoreDashboardCards: TaskStateItem;
  loadMoreTasksPerDueDate: TaskStateItem;
  loadMoreTasksPerStage: TaskStateItem;
  savePopoverState: TaskStateItem;
  addAttachment: TaskStateItem;
  removeAttachment: TaskStateItem;
  updateName: TaskStateItem;
  updateStage: TaskStateItem;
  updateStatus: TaskStateItem;
  updateUsers: TaskStateItem;
  updateDates: TaskStateItem;
  updateDescription: TaskStateItem;
  addTodoList: TaskStateItem;
  removeTodoList: TaskStateItem;
  editTodoList: TaskStateItem;
  addTodo: TaskStateItem;
  removeTodo: TaskStateItem;
  editTodo: TaskStateItem;
  removeTimeEntry: TaskStateItem;
  addTimeEntry: TaskStateItem;
  fetchWidgets: TaskStateItem;
}

export function initialStateItem(valuePresent: boolean = true): TaskStateItem {
  const baseObj = {
    error: false,
    errorData: null,
    pending: false,
    success: false,
  };
  return valuePresent ? { ...baseObj, value: null } : baseObj;
}

export const initialState: TaskState = {
  deleteTaskLayoutDueDate: initialStateItem(),
  deleteTaskLayoutProject: initialStateItem(),
  fetchDashboardCards: initialStateItem(),
  fetchDashboardCardsByProject: initialStateItem(),
  fetchDashboardCardsByDueDate: initialStateItem(),
  fetchDashboardUsers: initialStateItem(),
  fetchTask: initialStateItem(),
  loadMoreDashboardCards: initialStateItem(),
  loadMoreTasksPerDueDate: initialStateItem(),
  loadMoreTasksPerStage: initialStateItem(),
  savePopoverState: initialStateItem(),
  addAttachment: initialStateItem(),
  removeAttachment: initialStateItem(),
  updateName: initialStateItem(false),
  updateStage: initialStateItem(false),
  updateStatus: initialStateItem(false),
  updateUsers: initialStateItem(false),
  updateDates: initialStateItem(false),
  updateDescription: initialStateItem(false),
  addTodoList: initialStateItem(false),
  removeTodoList: initialStateItem(false),
  editTodoList: initialStateItem(false),
  addTodo: initialStateItem(false),
  removeTodo: initialStateItem(false),
  editTodo: initialStateItem(false),
  removeTimeEntry: initialStateItem(false),
  addTimeEntry: initialStateItem(false),
  fetchWidgets: initialStateItem(false),
};

export type TaskReducer = Reducer<TaskState, TaskAction>;

const defaultReducer: TaskReducer = (state, _) => state;

const defaultReducerSlice = { [DEFAULT]: defaultReducer };

const selectReducer = (actionType: string): TaskReducer => {
  const actionToReducerMap = mergeAll([
    defaultReducerSlice, addAttachmentReducerSlice, addTodoListReducerSlice,
    addTodoReducerSlice, deleteTaskLayoutDueDateReducerSlice,
    deleteTaskLayoutProjectReducerSlice, editTodoListReducerSlice,
    editTodoReducerSlice, fetchDashboardCardsByDueDateReducerSlice,
    fetchDashboardCardsByProjectReducerSlice, fetchDashboardCardsReducerSlice,
    fetchDashboardUsersReducerSlice, fetchTaskReducerSlice, loadMoreDashboardCardsReducerSlice,
    loadMoreTasksPerDueDateReducerSlice, loadMoreTasksPerStageReducerSlice,
    removeAttachmentReducerSlice, removeTodoListReducerSlice, removeTodoReducerSlice,
    savePopoverStateReducerSlice, updateStageReducerSlice, updateStatusReducerSlice,
    updateUsersReducerSlice, removeTimeEntryReducerSlice, addTimeEntryReducerSlice,
    updateDatesReducerSlice, updateUsersReducerSlice, updateNameReducerSlice,
    updateDescriptionReducerSlice, updateCommentsCountReducerSlice, fetchWidgetsReducerSlice,
    addNewTaskToWidgetsSlice,
  ]);

  return actionToReducerMap[actionType] || actionToReducerMap[DEFAULT];
};

export function taskReducer(state = initialState, action) {
  const reducer: TaskReducer = selectReducer(action.type);
  return reducer(state, action);
}
