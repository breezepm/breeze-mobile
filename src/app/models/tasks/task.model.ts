import { Project } from '../projects/board.model';

export interface Task {
  name: string;
  addLast?: boolean;
  id: number;
  card_id?: number;
  card_name?: string;
  project_id: number;
  position: number;
  cover: any;
  status_code: number;
  startdate: string;
  mentions?: number[];
  duedate: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  comments_count: number;
  todos_count: number;
  done_todos: number;
  swimlane_id: number;
  planned_time: number;
  total_tracked: number;
  attachments_count: number;
  color: any;
  ready: boolean;
  onhold: boolean;
  blocked: boolean;
  done: boolean;
  hidden?: boolean;
  users: any[];
  user: any;
  tags: any[];
  tags_new: any[];
  description?: string;
  stage_id?: number;
  upload_bucket?: string;
  s3_access_key?: string;
  s3_key?: string;
  s3_policy?: any;
  s3_signature?: any;
  status_short?: string;
  statuses?: {
    status_id: number,
    status_name: string,
    status_color: string,
  };
  status_id?: number;
  status_name?: string;
  status_color?: string;
  element_type?: string;
  project?: {
    id: number;
    name: string;
    show_task_ids?: boolean;
  };
  stage?: {
    id: number;
    name: string
  };
  todo_lists?: TodoList[];
  time_entries?: any[];
  attachments?: any[];
  comments?: any[];
  current_user?: {
    observer: boolean;
    can_see_time_estimate: boolean;
    observer_move: boolean
  };
  csize?: any;
  duedate_time?: boolean;
  gitlab_id?: number;
  properties?: string;
  recurring?: any;
  request_date?: string;
  startdate_time?: boolean;
  temp_id?: number;
  token?: string;
  cover_id?: number;
  tsv_body?: string;
  user_id?: number;
  duedate_block?: number;
}

export interface TasksResponse {
  last_page: boolean;
  cards: Task[];
}

export interface TasksPayload extends TasksResponse {
  swimlaneId: number;
  stageId: number;
}

export type AttachmentCountActionType = 'add'|'remove';

export interface TaskAttachmentParams {
  attachmentId?: number;
  projectId: number;
  taskId: number;
  swimlaneId?: number;
  stageId?: number;
  dueDateBlock?: number;
  type?: AttachmentCountActionType;
}

export interface TaskAttachmentPayload {
  data: {
    bucket: string;
    name: string;
    key: string;
    s3name: string;
  };
  params: TaskAttachmentParams;
}

export interface TodoList {
  name: string;
  todos: Todo[];
  readonly id: number;
  readonly card_id: number;
  readonly created_at: string;
  readonly position: number;
  readonly tsv_body: string;
  readonly updated_at: string;
}

export interface Todo {
  assigned: string;
  done: boolean;
  duedate: string;
  name: string;
  readonly card_id: number;
  readonly created_at: string;
  readonly creator: number;
  readonly id: number;
  readonly position: number;
  readonly project_id: number;
  readonly tid: number;
  readonly todo_list_id: number;
  readonly tsv_body: string;
  readonly updated_at: string;
  readonly user_id: number;
}

export interface TaskTodoListParams {
  readonly listId?: number;
  readonly name?: string;
  readonly dueDateBlock?: number;
  readonly todos?: Todo[];
  readonly projectId: number;
  readonly swimlaneId: number;
  readonly stageId: number;
  readonly taskId: number;
}

export interface TaskTodoParams extends TaskTodoListParams {
  readonly todoId?: number;
  readonly todo?: Todo;
  readonly wasTodoDone?: boolean;
}

export interface TimeEntryParams {
  entryId?: number;
  taskId: number;
  projectId: number;
  tracked?: number;
  task?: Task;
}

export interface TaskTimeEntries {
  desc: string;
  id: number;
  logged_date: string;
  notbillable: boolean;
  owner: boolean;
  tracked: number;
  user_email: string;
  user_id: number;
  user_name: string;
}

export interface TaskStatuses {
  id: number;
  color: string;
  name: string;
}

export interface Widget {
  cards: Task[];
  projects: Project[];
}
