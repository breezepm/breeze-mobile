import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/';
import 'rxjs/add/operator/concat';
import { pick } from 'ramda';

import { HttpInterceptor, ServerError } from '../../../providers/http.interceptor';
import {
  CommentParams, Comment, FetchedComment, CommentAttachmentPayload,
  CommentAttachment, CommentAttachmentParams, CommentActionType,
} from './../../../models/task-comment/task-comment.model';
import {
  FETCH_COMMENTS, ADD_COMMENT, REMOVE_COMMENT, EDIT_COMMENT,
  ADD_ATTACHMENT_TO_COMMENT, REMOVE_ATTACHMENT_FROM_COMMENT,
  FetchComments, FetchCommentsSuccess, FetchCommentsError,
  AddComment, AddCommentSuccess, AddCommentError,
  RemoveComment, RemoveCommentSuccess, RemoveCommentError,
  EditComment, EditCommentSuccess, EditCommentError,
  AddAttachmentToComment, AddAttachmentToCommentSuccess,
  RemoveAttachmentFromComment,
  fetchCommentsSuccess, fetchCommentsError,
  addCommentSuccess, addCommentError,
  removeCommentSuccess, removeCommentError,
  editCommentSuccess, editCommentError,
  addAttachmentToCommentSuccess, addAttachmentToCommentError,
  removeAttachmentFromCommentSuccess, removeAttachmentFromCommentError,
  Default, defaultAction,
} from './../actions/task-comment.actions';
import { updateCommentsCountOnList } from './../actions/task.actions';
import {
  updateTaskCommentsCount,
  UpdateTaskCommentsCount,
  TaskCommentParams,
} from './../../projects/actions/project.actions';
import { parseToFetchedComment } from '../../../helpers/parse-to-fetched-comment';

const getTaskCommentParams: (p: CommentParams) => TaskCommentParams = pick(
  [ 'stageId', 'type', 'taskId', 'swimlaneId', 'dueDateBlock', 'projectId', 'mentions' ]
);

@Injectable()
export class TaskCommentEffects {

  @Effect() public fetchComments$ = this.actions$
    .ofType(FETCH_COMMENTS)
    .map<FetchComments, CommentParams>(toPayload)
    .switchMap(this.fetchComments.bind(this));

  @Effect() public addComment$ = this.actions$
    .ofType(ADD_COMMENT)
    .map<AddComment, CommentParams>(toPayload)
    .switchMap(this.addComment.bind(this));

  @Effect() public removeComment$ = this.actions$
    .ofType(REMOVE_COMMENT)
    .map<RemoveComment, CommentParams>(toPayload)
    .switchMap(this.removeComment.bind(this));

  @Effect() public editComment$ = this.actions$
    .ofType(EDIT_COMMENT)
    .map<EditComment, CommentParams>(toPayload)
    .switchMap(this.editComment.bind(this));

  @Effect() public addAttachmentToComment$ = this.actions$
    .ofType(ADD_ATTACHMENT_TO_COMMENT)
    .map<AddAttachmentToComment, CommentAttachmentPayload>(toPayload)
    .switchMap(this.addAttachmentToComment.bind(this));

  @Effect() public removeAttachmentFromComment$ = this.actions$
    .ofType(REMOVE_ATTACHMENT_FROM_COMMENT)
    .map<RemoveAttachmentFromComment, CommentAttachmentParams>(toPayload)
    .switchMap(this.removeAttachment.bind(this));

  constructor(private actions$: Actions, private http: HttpInterceptor) {}

  private fetchComments(params: CommentParams): Observable<FetchCommentsSuccess | FetchCommentsError> {
    const url: string = `/projects/${params.projectId}/cards/${params.taskId}/comments`;
    return this.http.get(url)
      .map<FetchedComment[], FetchCommentsSuccess>(fetchCommentsSuccess)
      .catch((error: ServerError) => Observable.of(fetchCommentsError(error)));
  }

  private addComment(p: CommentParams): Observable<AddCommentSuccess|UpdateTaskCommentsCount|AddCommentError> {

    const url: string = `/projects/${p.projectId}/cards/${p.taskId}/comments`;

    const taskCommentParams = getTaskCommentParams(p);

    const addCommentSuccess$ = Observable.from([
      addCommentSuccess(p),
      updateTaskCommentsCount(taskCommentParams),
      updateCommentsCountOnList(taskCommentParams),
    ]);

    const request$ = this.http.post(url, { comment: p.comment, mentions: p.mentions })
      .map<Comment, FetchedComment>(parseToFetchedComment)
      .map<FetchedComment, AddCommentSuccess>(addCommentSuccess)
      .catch((error: ServerError) => Observable.of(addCommentError(error)));

    return addCommentSuccess$.concat(request$);
  }

  private removeComment(p: CommentParams): Observable<RemoveCommentSuccess|UpdateTaskCommentsCount|RemoveCommentError> {

    const url = `/projects/${p.projectId}/cards/${p.taskId}/comments/${p.commentId}`;

    const taskCommentParams = getTaskCommentParams(p);

    const removeCommentSuccess$ = Observable.from([
      removeCommentSuccess(p),
      updateTaskCommentsCount(taskCommentParams),
      updateCommentsCountOnList(taskCommentParams),
    ]);

    const request$ = this.http.delete(url)
      .map<string, Default>(defaultAction)
      .catch((error: ServerError) => Observable.of(removeCommentError(error)));

    return removeCommentSuccess$.concat(request$);
  }

  private editComment(params: CommentParams): Observable<EditCommentSuccess | EditCommentError> {
    const url: string = `/projects/${params.projectId}/cards/${params.taskId}/comments/${params.commentId}`;
    const editCommentSuccess$ = Observable.of(editCommentSuccess(params));
    const request$ = this.http.put(url, { id: params.commentId, comment: params.comment, mentions: params.mentions })
      .map<Comment, Default>(defaultAction)
      .catch((error: ServerError) => Observable.of(editCommentError(error)));

    return editCommentSuccess$.concat(request$);
  }

  private addAttachmentToComment(payload: CommentAttachmentPayload) {
    const { params, data } = payload;
    const url: string = `/projects/${params.projectId}/cards/${params.taskId}/comments/${params.commentId}/attachments`;
    return this.http.post(url, data)
      .map<CommentAttachment, AddAttachmentToCommentSuccess>((att) => addAttachmentToCommentSuccess({
        ...att,
        commentId: params.commentId,
      }))
      .catch((error: ServerError) => Observable.of(addAttachmentToCommentError(error)));
  }

  private removeAttachment(params: CommentAttachmentParams) {
    const taskUrl = `/projects/${params.projectId}/cards/${params.taskId}`;
    const attachmentUrl = `comments/${params.commentId}/attachments/${params.attachmentId}`;
    const url = `${taskUrl}/${attachmentUrl}`;

    const removeAttachmentSuccess$ = Observable.of(removeAttachmentFromCommentSuccess(params));
    const request$ = this.http.delete(url)
      .map<string, Default>(defaultAction)
      .catch((error: ServerError) => Observable.of(removeAttachmentFromCommentError(error)));

    return removeAttachmentSuccess$.concat(request$);
  }

}
