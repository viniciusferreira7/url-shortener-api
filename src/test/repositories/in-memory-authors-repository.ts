import type { AuthorsRepository } from '@/domain/url-shortening/application/repositories/authors-repository';
import type { Author } from '@/domain/url-shortening/enterprise/entities/author';

export class InMemoryAuthorsRepository implements AuthorsRepository {
	public items: Author[] = [];

	async create(author: Author): Promise<Author> {
		this.items.push(author);
		return author;
	}

	async findByEmail(email: string): Promise<Author | null> {
		const author = this.items.find((item) => item.email === email);
		return author || null;
	}

	async findById(id: string): Promise<Author | null> {
		const author = this.items.find((item) => item.id.toString() === id);
		return author || null;
	}
}
