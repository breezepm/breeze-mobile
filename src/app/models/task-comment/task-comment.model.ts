export interface Attachment {
  readonly id: number;
  readonly name: string;
  readonly url: string;
}

export interface Commenter {
  readonly id?: number;
  readonly email?: string;
  readonly name?: string;
  readonly avatar?: string;
  readonly color?: string;
  readonly initials?: string;
}

export type CommentActionType = 'add'|'remove';

export interface CommentParams {
  readonly projectId: number;
  readonly taskId: number;
  readonly stageId?: number;
  readonly swimlaneId?: number;
  readonly type?: CommentActionType;
  readonly commentId?: number;
  readonly comment?: string;
  readonly user?: Commenter;
  readonly dueDateBlock?: number;
  readonly mentions?: number[];
}

export interface Comment {
  readonly attachments_count: number;
  readonly avatar: string;
  readonly card_id: number;
  readonly color: string;
  readonly comment: string;
  readonly created_at: string;
  readonly hidden: boolean;
  readonly id: number;
  readonly initials: string;
  readonly owner: boolean;
  readonly tid: any;
  readonly tsv_body: any;
  readonly updated_at: string;
  readonly user_id: number;
  readonly user: string;
}

export interface FetchedComment {
  readonly attachments?: Attachment[];
  readonly id: number;
  readonly card: number;
  readonly comment: string;
  readonly hidden: boolean;
  readonly updated_at: string;
  readonly created_at: string;
  readonly user: Commenter;
}

export interface CommentAttachmentParams {
  attachmentId?: number;
  commentId: number;
  projectId: number;
  taskId: number;
}

export interface CommentAttachmentPayload {
  data: {
    bucket: string;
    name: string;
    key: string;
    s3name: string;
  };
  params: CommentAttachmentParams;
}

export interface TaskAttachment {
  attachable_id: number;
  attachable_type: string;
  bucket: string;
  card_id: number;
  created_at: string;
  deleted_at: string;
  embeded: boolean;
  id: number;
  key: string;
  name: string;
  project_id: number;
  s3name: string;
  thumb: boolean;
  thumb_url: string;
  tsv_body: any;
  updated_at: string;
  url: string;
  stageId?: number;
  swimlaneId?: number;
  dueDateBlock?: number;
}

export interface CommentAttachment extends TaskAttachment {
  commentId: number;
}
