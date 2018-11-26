import {
  DEFAULT,
  FETCH_COMMENTS, FETCH_COMMENTS_SUCCESS, FETCH_COMMENTS_ERROR,
  ADD_COMMENT, ADD_COMMENT_SUCCESS, ADD_COMMENT_ERROR,
  REMOVE_COMMENT, REMOVE_COMMENT_SUCCESS, REMOVE_COMMENT_ERROR,
  EDIT_COMMENT, EDIT_COMMENT_ERROR, EDIT_COMMENT_SUCCESS,
  ADD_ATTACHMENT_TO_COMMENT, ADD_ATTACHMENT_TO_COMMENT_SUCCESS, ADD_ATTACHMENT_TO_COMMENT_ERROR,
  REMOVE_ATTACHMENT_FROM_COMMENT, REMOVE_ATTACHMENT_FROM_COMMENT_SUCCESS,
  REMOVE_ATTACHMENT_FROM_COMMENT_ERROR, TaskCommentAction,
} from '../actions/task-comment.actions';
import { Reducer, updateState } from '../../../actions-utils';
import {
  FetchedComment, CommentParams, CommentAttachment,
  CommentAttachmentPayload, CommentAttachmentParams,
} from './../../../models/task-comment/task-comment.model';
import { sortByDateDesc } from './../../../helpers/sort-by-date-desc';
import { map, when, propEq, assoc, reject, evolve, prepend } from 'ramda';

export interface TaskCommentStateItem {
  error: boolean;
  errorData: any;
  pending: boolean;
  success: boolean;
  value?: any;
}

export interface TaskCommentState {
  fetchComments: TaskCommentStateItem;
  addComment: TaskCommentStateItem;
  removeComment: TaskCommentStateItem;
  editComment: TaskCommentStateItem;
  addAttachmentToComment: TaskCommentStateItem;
  removeAttachmentFromComment: TaskCommentStateItem;
}

function initialStateItem(valuePresent: boolean = true): TaskCommentStateItem {
  const baseObj = {
    error: false,
    errorData: null,
    pending: false,
    success: false,
  };
  return valuePresent ? { ...baseObj, value: null } : baseObj;
}

export const initialState: TaskCommentState = {
  fetchComments: initialStateItem(),
  addComment: initialStateItem(),
  removeComment: initialStateItem(),
  editComment: initialStateItem(),
  addAttachmentToComment: initialStateItem(),
  removeAttachmentFromComment: initialStateItem(),
};

type TaskCommentReducer = Reducer<TaskCommentState, TaskCommentAction>;

const fetchCommentsReducer: TaskCommentReducer = (state, action) =>
  updateState(state, 'fetchComments', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const fetchCommentsSuccessReducer: TaskCommentReducer = (state, action) =>
  updateState(state, 'fetchComments', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: sortByDateDesc(<FetchedComment[]> action.payload),
  });

const fetchCommentsErrorReducer: TaskCommentReducer = (state, action) =>
  updateState(state, 'fetchComments', <TaskCommentStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const addCommentReducer: TaskCommentReducer = (state, action) =>
  updateState(state, 'addComment', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const addCommentSuccessReducer: TaskCommentReducer = (state, action) => {
  const newFetchComments = updateState(state, 'fetchComments', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: [ action.payload, ...state.fetchComments.value.filter(c => c.id != null) ],
  });

  return updateState(newFetchComments, 'addComment', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });
};

const addCommentErrorReducer: TaskCommentReducer = (state, action) =>
  updateState(state, 'addComment', <TaskCommentStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const removeCommentReducer: TaskCommentReducer = (state, action) =>
  updateState(state, 'removeComment', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const removeCommentSuccessReducer: TaskCommentReducer = (state, action) => {
  const commentParams = <CommentParams> action.payload;
  const comments = <FetchedComment[]> state.fetchComments.value;
  const filterComments = reject<FetchedComment>(propEq('id', commentParams.commentId));

  const newFetchComments = updateState(state, 'fetchComments', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: filterComments(comments),
  });

  return updateState(newFetchComments, 'removeComment', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });
};

const removeCommentErrorReducer: TaskCommentReducer = (state, action) =>
  updateState(state, 'removeComment', <TaskCommentStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const editCommentReducer: TaskCommentReducer = (state, action) =>
  updateState(state, 'editComment', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload,
  });

const editCommentSuccessReducer: TaskCommentReducer = (state, action) => {
  const params = action.payload as CommentParams;
  const currentComments: FetchedComment[] = state.fetchComments.value;

  const commentIdMatches = propEq('id', params.commentId);
  const changeCommentText = assoc('comment', params.comment);
  const updateComments = map(when(commentIdMatches, changeCommentText));

  const newFetchComment = updateState(state, 'fetchComments', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: updateComments(currentComments),
  });

  return updateState(newFetchComment, 'editComment', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });
};

const editCommentErrorReducer: TaskCommentReducer = (state, action) =>
  updateState(state, 'editComment', <TaskCommentStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const addAttachmentToCommentReducer: TaskCommentReducer = (state, action) =>
  updateState(state, 'addAttachmentToComment', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload as CommentAttachmentPayload,
  });

const addAttachmentToCommentSuccessReducer: TaskCommentReducer = (state, action) => {
  const attachment = action.payload as CommentAttachment;
  const comments: FetchedComment[] = state.fetchComments.value;

  const prependAttachment = evolve({ attachments: prepend(attachment) });
  const updateComments = map(when(propEq('id', attachment.commentId), prependAttachment));

  const newFetchComment = updateState(state, 'fetchComments', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: updateComments(comments),
  });

  return updateState(newFetchComment, 'addAttachmentToComment', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });
};

const addAttachmentToCommentErrorReducer: TaskCommentReducer = (state, action) =>
  updateState(state, 'addAttachmentToComment', <TaskCommentStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const removeAttachmentFromCommentReducer: TaskCommentReducer = (state, action) =>
  updateState(state, 'removeAttachmentFromComment', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: true,
    success: false,
    value: action.payload as CommentAttachmentParams,
  });

const removeAttachmentFromCommentSuccessReducer: TaskCommentReducer = (state, action) => {
  const params = action.payload as CommentAttachmentParams;
  const currentComments: FetchedComment[] = state.fetchComments.value;

  const filterAttachment = evolve({ attachments: reject(propEq('id', params.attachmentId)) });
  const updateComments = map(when(propEq('id', params.commentId), filterAttachment));

  const newFetchComment = updateState(state, 'fetchComments', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: updateComments(currentComments),
  });

  return updateState(newFetchComment, 'removeAttachmentFromComment', <TaskCommentStateItem> {
    error: false,
    errorData: null,
    pending: false,
    success: true,
    value: action.payload,
  });
};

const removeAttachmentFromCommentErrorReducer: TaskCommentReducer = (state, action) =>
  updateState(state, 'removeAttachmentFromComment', <TaskCommentStateItem> {
    error: true,
    errorData: action.payload,
    pending: false,
    success: false,
    value: null,
  });

const defaultReducer: TaskCommentReducer = (state, _) => state;

const selectReducer = (actionType: string): TaskCommentReducer => {
  const actionToReducerMap = {
    [FETCH_COMMENTS]: fetchCommentsReducer,
    [FETCH_COMMENTS_SUCCESS]: fetchCommentsSuccessReducer,
    [FETCH_COMMENTS_ERROR]: fetchCommentsErrorReducer,
    [ADD_COMMENT]: addCommentReducer,
    [ADD_COMMENT_SUCCESS]: addCommentSuccessReducer,
    [ADD_COMMENT_ERROR]: addCommentErrorReducer,
    [REMOVE_COMMENT]: removeCommentReducer,
    [REMOVE_COMMENT_SUCCESS]: removeCommentSuccessReducer,
    [REMOVE_COMMENT_ERROR]: removeCommentErrorReducer,
    [EDIT_COMMENT]: editCommentReducer,
    [EDIT_COMMENT_SUCCESS]: editCommentSuccessReducer,
    [EDIT_COMMENT_ERROR]: editCommentErrorReducer,
    [ADD_ATTACHMENT_TO_COMMENT]: addAttachmentToCommentReducer,
    [ADD_ATTACHMENT_TO_COMMENT_SUCCESS]: addAttachmentToCommentSuccessReducer,
    [ADD_ATTACHMENT_TO_COMMENT_ERROR]: addAttachmentToCommentErrorReducer,
    [REMOVE_ATTACHMENT_FROM_COMMENT]: removeAttachmentFromCommentReducer,
    [REMOVE_ATTACHMENT_FROM_COMMENT_SUCCESS]: removeAttachmentFromCommentSuccessReducer,
    [REMOVE_ATTACHMENT_FROM_COMMENT_ERROR]: removeAttachmentFromCommentErrorReducer,
    [DEFAULT]: defaultReducer,
  };
  return actionToReducerMap[actionType] || actionToReducerMap[DEFAULT];
};

export function taskCommentReducer(state = initialState, action) {
  const reducer: TaskCommentReducer = selectReducer(action.type);
  return reducer(state, action);
}
