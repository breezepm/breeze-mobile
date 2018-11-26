import { camelize } from '../shared/mention/mention-utils';
import { Commenter } from '../models/task-comment/task-comment.model';

export const parseUsersToMentionNamesAndIds = (users: Commenter[]) =>
  users.map( (user: Commenter) =>
    ({ id: user.id, name: user.name ? camelize(user.name) : user.email })
  );
