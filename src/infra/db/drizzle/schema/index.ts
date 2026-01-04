export * from './accounts';
export * from './sessions';
export * from './urls';
export * from './users';
export * from './verifications';

import { urls } from './';
import { accounts } from './accounts';
import { sessions } from './sessions';
import { users } from './users';
import { verifications } from './verifications';

export const schema = {
  accounts,
  sessions,
  users,
  verifications,
  urls,
};
