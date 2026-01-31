import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const urls = pgTable(
  'urls',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar('name', { length: 255 }).notNull(),
    destinationUrl: text('destination_url').notNull(),
    code: text('code').notNull(),
    isPublic: boolean('is_public').notNull().default(false),
    description: varchar('description', { length: 575 }),
    likes: bigint('likes', { mode: 'number' }).notNull().default(0),
    score: bigint('score', { mode: 'number' }).notNull().default(0),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at'),

    authorId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [
    uniqueIndex('urls_code_unique_idx').on(table.code),
    index('urls_author_idx').on(table.authorId),
    index('urls_is_public_idx').on(table.isPublic),
  ]
);
