export interface Project {
  description: string;
  id: number;
  name: string;
  start: boolean;
}

export interface Board {
  position: number;
  projects: Project[];
  workspace: string;
  workspace_id: number;
  workspaces: any[];
}
