export * from './accounts';
export * from './sessions';
export * from './urls';
export * from './user-url-likes';
export * from './users';
export * from './verifications';

import { urls } from './';
import { accounts } from './accounts';
import { sessions } from './sessions';
import { userUrlLikes } from './user-url-likes';
import { users } from './users';
import { verifications } from './verifications';

export const schema = {
  accounts,
  sessions,
  users,
  verifications,
  urls,
  userUrlLikes,
};
