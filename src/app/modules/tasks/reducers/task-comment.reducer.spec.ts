import {
  addComment, addCommentSuccess, addCommentError,
  removeComment, removeCommentSuccess, removeCommentError,
  fetchComments, fetchCommentsSuccess, fetchCommentsError,
} from './../actions/task-comment.actions';
import { taskCommentReducer, initialState, TaskCommentStateItem, TaskCommentState } from './task-comment.reducer';
import { CommentParams, FetchedComment, Commenter } from './../../../models/task-comment/task-comment.model';
import { ServerError } from './../../../providers/http.interceptor';

describe('[reducer] taskCommentReducer', () => {
  const user: Commenter = {
    id: 2,
    email: '',
    initials: '',
    name: '',
    avatar: '',
    color: '',
  };

  const commentBase = { updated_at: 'never', hidden: false, user };

  const comment1: FetchedComment = {
    id: 1,
    card: 3,
    comment: 'Hi there',
    created_at: '1',
    ...commentBase,
  };

  const comment2: FetchedComment = {
    id: 2,
    card: 3,
    comment: 'Heloł, Yodita',
    created_at: '2',
    ...commentBase,
  };

  const commentWithNullID: FetchedComment = {
    id: null,
    card: 3,
    comment: 'Heloł, Yodita',
    created_at: '2',
    ...commentBase,
  };

  describe('Fetch comments action', () => {

    describe('[micro reducer] fetchComments', () => {

      it('should assign pending to true and the comment params to the value attribute', () => {
        const commentParams: CommentParams = { projectId: 1, taskId: 2 };
        const action = fetchComments(commentParams);
        const currentState: TaskCommentState = taskCommentReducer(initialState, action);
        const expected: TaskCommentStateItem = {
          error: false,
          errorData: null,
          pending: true,
          success: false,
          value: action.payload,
        };
        expect(currentState.fetchComments).toEqual(expected);
      });

    });

    describe('[micro reducer] fetchCommentsSuccess', () => {

      it('shoud assign success to true and the payload to the value attribute', () => {
        const action = fetchCommentsSuccess([ comment1 ]);
        const currentState: TaskCommentState = taskCommentReducer(initialState, action);
        const expected: TaskCommentStateItem = {
          error: false,
          errorData: null,
          pending: false,
          success: true,
          value: action.payload,
        };
        expect(currentState.fetchComments).toEqual(expected);
      });

    });

    describe('[micro reducer] fetchCommentsError', () => {

      it('should assign true to error and the error object to the errorData attribute', () => {
        const error: ServerError = { status: 401, data: {} };
        const action = fetchCommentsError(error);
        const currentState: TaskCommentState = taskCommentReducer(initialState, action);
        const expected: TaskCommentStateItem = {
          error: true,
          errorData: action.payload,
          pending: false,
          success: false,
          value: null,
        };
        expect(currentState.fetchComments).toEqual(expected);
      });

    });

  });

  describe('Add comment action', () => {

    describe('[micro reducer] addComment', () => {

      it('should assign pending to true and the comment params to the value attribute', () => {
        const commentParams: CommentParams = { projectId: 1, taskId: 2, comment: 'Hi' };
        const action = addComment(commentParams);
        const currentState: TaskCommentState = taskCommentReducer(initialState, action);
        const expected: TaskCommentStateItem = {
          error: false,
          errorData: null,
          pending: true,
          success: false,
          value: action.payload,
        };
        expect(currentState.addComment).toEqual(expected);
      });

    });

    describe('[micro reducer] addCommentSuccess', () => {

      const description = `should assign success to true and the payload to the value attribute
        and should also update the fetched comments with the new comment displayed in descending
        order after filtering the comments with no ID.`;

      it(description, () => {
        const comments = [ commentWithNullID, comment1 ];
        const fetchCommentsState: TaskCommentState = taskCommentReducer(initialState, fetchCommentsSuccess(comments));

        const action = addCommentSuccess(comment2);
        const currentState: TaskCommentState = taskCommentReducer(fetchCommentsState, action);

        const baseStateItem: TaskCommentStateItem = { error: false, errorData: null, pending: false, success: true };
        const expectedAddCommentState: TaskCommentStateItem = {
          ...baseStateItem,
          value: action.payload,
        };
        const expectedFetchedCommentsState: TaskCommentStateItem = {
          ...baseStateItem,
          value: [ comment2, comment1 ],
        };

        expect(currentState.addComment).toEqual(expectedAddCommentState);
        expect(currentState.fetchComments).toEqual(expectedFetchedCommentsState);
      });

    });

    describe('[micro reducer] addCommentError', () => {

      it('should assign true to error and the error object to the errorData attribute', () => {
        const error: ServerError = { status: 500, data: {} };
        const action = addCommentError(error);
        const currentState: TaskCommentState = taskCommentReducer(initialState, action);
        const expected: TaskCommentStateItem = {
          error: true,
          errorData: action.payload,
          pending: false,
          success: false,
          value: null,
        };
        expect(currentState.addComment).toEqual(expected);
      });

    });

  });

  describe('Remove comment action', () => {

    describe('[micro reducer] removeComment', () => {

      it('should assign pending to true and the comment params to the value attribute', () => {
        const commentParams: CommentParams = { projectId: 1, taskId: 2, commentId: 3 };
        const action = removeComment(commentParams);
        const currentState: TaskCommentState = taskCommentReducer(initialState, action);
        const expected: TaskCommentStateItem = {
          error: false,
          errorData: null,
          pending: true,
          success: false,
          value: action.payload,
        };
        expect(currentState.removeComment).toEqual(expected);
      });

    });

    describe('[micro reducer] removeCommentSuccess', () => {
      const description = `should assign true to success and the payload to the value attribute.
        Should also update the fetched comments removing the selected comment from the list`;

      it(description, () => {
        const comments = [ comment2, comment1 ];
        const fetchCommentsState: TaskCommentState = taskCommentReducer(initialState, fetchCommentsSuccess(comments));

        const commentParams: CommentParams = { projectId: 1, taskId: 3, commentId: 2 };
        const action = removeCommentSuccess(commentParams);
        const currentState: TaskCommentState = taskCommentReducer(fetchCommentsState, action);

        const baseStateItem: TaskCommentStateItem = { error: false, errorData: null, pending: false, success: true };
        const expectedRemoveCommentState: TaskCommentStateItem = {
          ...baseStateItem,
          value: action.payload,
        };
        const expectedFetchedCommentsState: TaskCommentStateItem = {
          ...baseStateItem,
          value: [ comment1 ],
        };

        expect(currentState.removeComment).toEqual(expectedRemoveCommentState);
        expect(currentState.fetchComments).toEqual(expectedFetchedCommentsState);
      });

    });

    describe('[micro reducer] removeCommentError', () => {

      it('should assign true to error and the error object to the errorData attribute', () => {
        const error: ServerError = { status: 422, data: {} };
        const action = removeCommentError(error);
        const currentState: TaskCommentState = taskCommentReducer(initialState, action);
        const expected: TaskCommentStateItem = {
          error: true,
          errorData: action.payload,
          pending: false,
          success: false,
          value: null,
        };
        expect(currentState.removeComment).toEqual(expected);
      });

    });

  });

});
