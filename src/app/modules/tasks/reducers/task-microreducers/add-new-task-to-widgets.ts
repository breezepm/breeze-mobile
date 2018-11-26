import { TaskReducer, TaskStateItem } from '../task.reducer';
import { updateState } from '../../../../actions-utils';
import { ADD_NEW_TASK_TO_WIDGETS } from './../../actions/task.actions';
import { dropLast, pipe, prepend } from 'ramda';

const addNewTaskToWidgetsReducer: TaskReducer = (state, action) => {
  const tasksList = state.fetchWidgets.value.cards;

  const updatedTasksList = pipe<any[], any, any>(
    dropLast(1),
    prepend(action.payload)
  )(tasksList);

  const widgetsList = state.fetchWidgets.value;
  const updatedWidgets = { ...widgetsList, cards: updatedTasksList };

  return updateState(state, 'fetchWidgets', <TaskStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: updatedWidgets,
  });
};

export const addNewTaskToWidgetsSlice = {
  [ADD_NEW_TASK_TO_WIDGETS]: addNewTaskToWidgetsReducer,
};
