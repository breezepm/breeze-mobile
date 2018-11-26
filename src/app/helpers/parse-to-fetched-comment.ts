import { Comment, FetchedComment } from './../models/task-comment/task-comment.model';

export function parseToFetchedComment(object: Comment): FetchedComment {
  return {
    attachments: [],
    id: object.id,
    card: object.card_id,
    comment: object.comment,
    hidden: object.hidden,
    updated_at: object.updated_at,
    created_at: object.created_at,
    user: {
      id: object.user_id,
      email: object.user,
      name: object.user,
      avatar: object.avatar,
      color: object.color,
      initials: object.initials,
    },
  };
}
