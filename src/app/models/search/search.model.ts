import { ProjectDetails } from '../projects/project-details.model';

export interface SearchResult {
  result_header: string;
  result_body: string;
  footer: string;
  created_at: string;
  archived: boolean;
  project: ProjectDetails;
  card_id: number;
}

export interface SearchParams {
  query?: string;
  project?: boolean;
  card?: boolean;
  comment?: boolean;
  todo?: boolean;
  file?: boolean;
  tag?: boolean;
  page?: number;
}
