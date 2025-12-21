import type { Author } from '../../enterprise/entities/author';

export interface AuthorsRepository {
  findByEmail(email: string): Promise<Author | null>;
  findById(id: string): Promise<Author | null>;
  save(author: Author): Promise<Author>;
}
