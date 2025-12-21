import type { AuthorsRepository } from '@/domain/url-shortening/application/repositories/authors-repository';
import type { Author } from '@/domain/url-shortening/enterprise/entities/author';
import type { cassandraClient } from '../../cassandra/client';

export class DrizzleAuthorsRepository implements AuthorsRepository {
  constructor(private readonly db: typeof cassandraClient) {}
  create(author: Author): Promise<Author> {
    // throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<Author | null> {
    // throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Author | null> {
    // throw new Error('Method not implemented.');
  }
  save(author: Author): Promise<Author> {
    // throw new Error('Method not implemented.');
  }
}
