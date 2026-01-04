import {
  index,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { urls } from './urls';
import { users } from './users';

export const userUrlLikes = pgTable(
  'user_url_likes',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    urlId: uuid('url_id')
      .notNull()
      .references(() => urls.id, { onDelete: 'cascade' }),
    likedAt: timestamp('liked_at')
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.urlId] }),
    index('user_url_likes_user_idx').on(table.userId),
    index('user_url_likes_url_idx').on(table.urlId),
  ]
);
