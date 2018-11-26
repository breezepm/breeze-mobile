export interface UserCredentials {
  email: string;
  password: string;
}

export interface Team {
  name: string;
  owner_email: string;
  team_id: number;
}

export interface User {
  id: number;
  team_id: number;
  name: string;
  email: string;
  color: string;
  initials: string;
  avatar: string;
  observer: boolean;
  observer_move: boolean;
  can_see_timetracking: boolean;
  can_see_estimates: boolean;
  can_see_client_comments: boolean;
  admin: boolean;
  owner: boolean;
  admin_owner: boolean;
  token: string;
  can_archive_task: boolean;
  can_delete_task: boolean;
  project_admin: boolean;
  super_admin: boolean;
  assign_tasks_self: any[];
  comments_newest: boolean;
  can_track_time: boolean;
  request_date: boolean;
  can_edit_todos: boolean;
  calendar_show_project: boolean;
  plan: any;
  paid_until: string;
  teams: Team[];
  real_user_team_id: number;
  real_user_team_name: any;
}
