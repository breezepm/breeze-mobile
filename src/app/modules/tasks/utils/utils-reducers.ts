import { compose, path, equals, merge, propIs, head, prop, defaultTo } from 'ramda';

import { Task } from './../../../models/tasks/task.model';
import { DashboardCard, DashboardLayout } from './../actions/task.actions';
import { TaskStateItem } from './../reducers/task.reducer';

const defaultDashboardLayout: DashboardLayout = 'project';

export const checkListLayout =
  compose<DashboardCard[], DashboardCard, DashboardCard, DashboardLayout, (val: DashboardLayout) => boolean>(
    equals,
    prop('dashboard_layout'),
    defaultTo({ dashboard_layout: defaultDashboardLayout }),
    head
  );

export const getTasksList = path<DashboardCard[]>(['fetchDashboardCards', 'value']);

export const getTask = path<Task>(['fetchTask', 'value']);

export const mergeWithBaseItem = merge<TaskStateItem>({
  error: false,
  errorData: null,
  pending: false,
  success: true,
});

export const idIsNumber = propIs(Number, 'id');
