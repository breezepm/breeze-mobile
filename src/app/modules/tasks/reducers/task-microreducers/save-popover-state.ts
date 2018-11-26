import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { SAVE_POPOVER_STATE, RESET_POPOVER_STATE } from './../../actions/task.actions';

const savePopoverStateReducer: TaskReducer = (state, action) =>
  updateState(state, 'savePopoverState', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });

const resetPopoverStateReducer: TaskReducer = (state, _) =>
  updateState(state, 'savePopoverState', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: false,
    value: null,
  });

export const savePopoverStateReducerSlice = {
  [SAVE_POPOVER_STATE]: savePopoverStateReducer,
  [RESET_POPOVER_STATE]: resetPopoverStateReducer,
};
