import { DashboardCard, Stage } from '../app/modules/tasks/actions/task.actions';
import { Task } from '../app/models/tasks/task.model';

const taskMock: Task = {
  name: 'string',
  id: 5,
  card_id: 5,
  project_id: 5,
  position: 5,
  cover: {},
  status_code: 5,
  startdate: 'string',
  duedate: 'string',
  created_at: 'string',
  updated_at: 'string',
  deleted_at: 'string',
  comments_count: 5,
  todos_count: 5,
  done_todos: 5,
  swimlane_id: 5,
  planned_time: 5,
  total_tracked: 5,
  attachments_count: 5,
  color: {},
  ready: true,
  onhold: true,
  blocked: true,
  done: true,
  hidden: true,
  users: [{}, {}],
  user: {},
  tags: [{}, {}],
  tags_new: [{}, {}],
};

const stageMock: Stage = {
  cards: [taskMock],
  next_page: true,
  stage_id: 5,
  stage_name: 'string',
};

export const dashboardCardMock: DashboardCard = {
  dashboard_layout: 'project',
  next_page: true,
  project_id: 55,
  project_name: 'foo',
  stages: [stageMock],
};
