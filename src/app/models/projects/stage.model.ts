import { Task } from './../tasks/task.model';

export interface Stage {
  cards: Task[];
  id: number;
  load_more: boolean;
  name: string;
  page?: number;
  project_id: number;
  status: any;
}
