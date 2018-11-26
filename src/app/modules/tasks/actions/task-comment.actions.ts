import { Action } from '@ngrx/store';
import {
  CommentParams, FetchedComment, CommentAttachmentPayload, CommentAttachment, CommentAttachmentParams,
} from './../../../models/task-comment/task-comment.model';
import { type, actionsDispatcher } from '../../../actions-utils';
import { ServerError } from '../../../providers/http.interceptor';

/* Actions Types */

export const DEFAULT = type('[Task Comment] No action match');

export const FETCH_COMMENTS = type('[Task Comment] Fetch Comments');
export const FETCH_COMMENTS_SUCCESS = type('[Task Comment] Fetch Comments Success');
export const FETCH_COMMENTS_ERROR = type('[Task Comment] Fetch Comments Error');

export const ADD_COMMENT = type('[Task Comment] Add Comment');
export const ADD_COMMENT_SUCCESS = type('[Task Comment] Add Comment Success');
export const ADD_COMMENT_ERROR = type('[Task Comment] Add Comment Error');

export const REMOVE_COMMENT = type('[Task Comment] Remove Comment');
export const REMOVE_COMMENT_SUCCESS = type('[Task Comment] Remove Comment Success');
export const REMOVE_COMMENT_ERROR = type('[Task Comment] Remove Comment Error');

export const EDIT_COMMENT = type('[Task Comment] Edit Comment');
export const EDIT_COMMENT_SUCCESS = type('[Task Comment] Edit Comment Success');
export const EDIT_COMMENT_ERROR = type('[Task Comment] Edit Comment Error');

export const ADD_ATTACHMENT_TO_COMMENT = type('[Task Comment] Add Attachment To Comment');
export const ADD_ATTACHMENT_TO_COMMENT_SUCCESS = type('[Task Comment] Add Attachment To Comment Success');
export const ADD_ATTACHMENT_TO_COMMENT_ERROR = type('[Task Comment] Add Attachment To Comment Error');

export const REMOVE_ATTACHMENT_FROM_COMMENT = type('[Task Comment] Remove Attachment From Comment');
export const REMOVE_ATTACHMENT_FROM_COMMENT_SUCCESS = type('[Task Comment] Remove Attachment From Comment Success');
export const REMOVE_ATTACHMENT_FROM_COMMENT_ERROR = type('[Task Comment] Remove Attachment From Comment Error');

/* Actions Interfaces */

export interface Default extends Action {
  payload?: any;
}

export interface FetchComments extends Action {
  payload: CommentParams;
}

export interface FetchCommentsSuccess extends Action {
  payload: FetchedComment[];
}

export interface FetchCommentsError extends Action {
  payload: ServerError;
}

export interface AddComment extends Action {
  payload: CommentParams;
}

export interface AddCommentSuccess extends Action {
  payload: CommentParams | FetchedComment;
}

export interface AddCommentError extends Action {
  payload: ServerError;
}

export interface RemoveComment extends Action {
  payload: CommentParams;
}

export interface RemoveCommentSuccess extends Action {
  payload: CommentParams;
}

export interface RemoveCommentError extends Action {
  payload: ServerError;
}

export interface EditComment extends Action {
  payload: CommentParams;
}

export interface EditCommentSuccess extends Action {
  payload: CommentParams;
}

export interface EditCommentError extends Action {
  payload: ServerError;
}

export interface AddAttachmentToComment extends Action {
  payload: CommentAttachmentPayload;
}

export interface AddAttachmentToCommentSuccess extends Action {
  payload: CommentAttachment;
}

export interface AddAttachmentToCommentError extends Action {
  payload: ServerError;
}

export interface RemoveAttachmentFromComment extends Action {
  payload: CommentAttachmentParams;
}

export interface RemoveAttachmentFromCommentSuccess extends Action {
  payload: CommentAttachmentParams;
}

export interface RemoveAttachmentFromCommentError extends Action {
  payload: ServerError;
}

export type TaskCommentAction =
  Default
  | FetchComments
  | FetchCommentsSuccess
  | FetchCommentsError
  | AddComment
  | AddCommentSuccess
  | AddCommentError
  | RemoveComment
  | RemoveCommentSuccess
  | RemoveCommentError
  | EditComment
  | EditCommentSuccess
  | EditCommentError
  | AddAttachmentToComment
  | AddAttachmentToCommentSuccess
  | AddAttachmentToCommentError
  | RemoveAttachmentFromComment
  | RemoveAttachmentFromCommentSuccess
  | RemoveAttachmentFromCommentError;

export const defaultAction = actionsDispatcher<null, Default>(DEFAULT);

export const fetchComments = actionsDispatcher<CommentParams, FetchComments>(FETCH_COMMENTS);
export const fetchCommentsSuccess = actionsDispatcher<FetchedComment[], FetchCommentsSuccess>(FETCH_COMMENTS_SUCCESS);
export const fetchCommentsError = actionsDispatcher<ServerError, FetchCommentsError>(FETCH_COMMENTS_ERROR);

export const addComment = actionsDispatcher<CommentParams, AddComment>(ADD_COMMENT);
export const addCommentSuccess =
  actionsDispatcher<CommentParams|FetchedComment, AddCommentSuccess>(ADD_COMMENT_SUCCESS);
export const addCommentError = actionsDispatcher<ServerError, AddCommentError>(ADD_COMMENT_ERROR);

export const removeComment = actionsDispatcher<CommentParams, RemoveComment>(REMOVE_COMMENT);
export const removeCommentSuccess = actionsDispatcher<CommentParams, RemoveCommentSuccess>(REMOVE_COMMENT_SUCCESS);
export const removeCommentError = actionsDispatcher<ServerError, RemoveCommentError>(REMOVE_COMMENT_ERROR);

export const editComment = actionsDispatcher<CommentParams, EditComment>(EDIT_COMMENT);
export const editCommentSuccess = actionsDispatcher<CommentParams, EditCommentSuccess>(EDIT_COMMENT_SUCCESS);
export const editCommentError = actionsDispatcher<ServerError, EditCommentError>(EDIT_COMMENT_ERROR);

export const addAttachmentToComment =
  actionsDispatcher<CommentAttachmentPayload, AddAttachmentToComment>(ADD_ATTACHMENT_TO_COMMENT);
export const addAttachmentToCommentSuccess =
  actionsDispatcher<CommentAttachment, AddAttachmentToCommentSuccess>(ADD_ATTACHMENT_TO_COMMENT_SUCCESS);
export const addAttachmentToCommentError =
  actionsDispatcher<ServerError, AddAttachmentToCommentError>(ADD_ATTACHMENT_TO_COMMENT_ERROR);

export const removeAttachmentFromComment =
  actionsDispatcher<CommentAttachmentParams, RemoveAttachmentFromComment>(REMOVE_ATTACHMENT_FROM_COMMENT);
export const removeAttachmentFromCommentSuccess =
  actionsDispatcher<CommentAttachmentParams, RemoveAttachmentFromCommentSuccess>(
    REMOVE_ATTACHMENT_FROM_COMMENT_SUCCESS
  );
export const removeAttachmentFromCommentError =
  actionsDispatcher<ServerError, RemoveAttachmentFromCommentError>(REMOVE_ATTACHMENT_FROM_COMMENT_ERROR);
