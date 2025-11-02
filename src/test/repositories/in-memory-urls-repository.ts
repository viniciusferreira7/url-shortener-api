import type {
	FindManyByAuthorIdParams,
	FindManyParams,
	FindManyWhereIsPublicParams,
	UrlsRepository,
} from '@/domain/url-shortening/application/repositories/urls-repository';
import type { Url } from '@/domain/url-shortening/enterprise/entities/url';
import { AuthorWithUrls } from '@/domain/url-shortening/enterprise/entities/value-object/author-with-urls';
import { UrlWithAuthor } from '@/domain/url-shortening/enterprise/entities/value-object/url-with-author';

export class InMemoryUrlsRepository implements UrlsRepository {
	public items: Url[] = [];

	async create(url: Url): Promise<Url> {
		this.items.push(url);
		return url;
	}

	async findById(id: string): Promise<Url | null> {
		const url = this.items.find((item) => item.id.toString() === id);
		return url || null;
	}

	async save(url: Url): Promise<Url> {
		const index = this.items.findIndex((item) => item.id.equals(url.id));

		if (index === -1) {
			this.items.push(url);
		} else {
			this.items[index] = url;
		}

		return url;
	}

	async delete(url: Url): Promise<Url> {
		const index = this.items.findIndex((item) => item.id.equals(url.id));

		if (index !== -1) {
			this.items.splice(index, 1);
		}

		return url;
	}

	async findMany(params: FindManyParams): Promise<Url[]> {
		const items = [...this.items];

		const isDescending = params.order.startsWith('-');
		const sortField = isDescending ? params.order.slice(1) : params.order;

		items.sort((a, b) => {
			let aValue: string | number | Date | boolean;
			let bValue: string | number | Date | boolean;

			switch (sortField) {
				case 'created_at':
					aValue = a.createdAt;
					bValue = b.createdAt;
					break;
				case 'updated_at':
					aValue = a.updatedAt || a.createdAt;
					bValue = b.updatedAt || b.createdAt;
					break;
				case 'title':
					aValue = a.name;
					bValue = b.name;
					break;
				case 'description':
					aValue = a.description || '';
					bValue = b.description || '';
					break;
				case 'value':
					aValue = a.value;
					bValue = b.value;
					break;
				case 'isPublic':
					aValue = a.isPublic ? 1 : 0;
					bValue = b.isPublic ? 1 : 0;
					break;
				default:
					return 0;
			}

			const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
			return isDescending ? -comparison : comparison;
		});

		const startIndex = (params.page - 1) * params.pageSize;
		const endIndex = startIndex + params.pageSize;

		return items.slice(startIndex, endIndex);
	}

	async findManyWhereIsPublic(
		params: FindManyWhereIsPublicParams
	): Promise<UrlWithAuthor[]> {
		const items = this.items.filter((item) => item.isPublic);

		const isDescending = params.order.startsWith('-');
		const sortField = isDescending ? params.order.slice(1) : params.order;

		items.sort((a, b) => {
			let aValue: string | number | Date | boolean;
			let bValue: string | number | Date | boolean;

			switch (sortField) {
				case 'created_at':
					aValue = a.createdAt;
					bValue = b.createdAt;
					break;
				case 'updated_at':
					aValue = a.updatedAt || a.createdAt;
					bValue = b.updatedAt || b.createdAt;
					break;
				case 'title':
					aValue = a.name;
					bValue = b.name;
					break;
				case 'description':
					aValue = a.description || '';
					bValue = b.description || '';
					break;
				case 'value':
					aValue = a.value;
					bValue = b.value;
					break;
				default:
					return 0;
			}

			const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
			return isDescending ? -comparison : comparison;
		});

		const startIndex = (params.page - 1) * params.pageSize;
		const endIndex = startIndex + params.pageSize;

		return items.slice(startIndex, endIndex).map((url) =>
			UrlWithAuthor.create({
				urlId: url.id,
				urlName: url.name,
				UrlValue: url.value,
				UrlDescription: url.description || '',
				UrlIsPublic: url.isPublic,
				authorId: url.authorId,
				authorName: '',
				createdAt: url.createdAt,
				updatedAt: url.updatedAt,
			})
		);
	}

	async findManyByAuthorId(
		params: FindManyByAuthorIdParams
	): Promise<AuthorWithUrls[]> {
		const authorMap = new Map<string, Url[]>();

		for (const url of this.items) {
			const authorId = url.authorId.toString();
			if (!authorMap.has(authorId)) {
				authorMap.set(authorId, []);
			}
			authorMap.get(authorId)?.push(url);
		}

		const isDescending = params.order.startsWith('-');
		const sortField = isDescending ? params.order.slice(1) : params.order;

		for (const [, urls] of authorMap) {
			urls.sort((a, b) => {
				let aValue: string | number | Date | boolean;
				let bValue: string | number | Date | boolean;

				switch (sortField) {
					case 'created_at':
						aValue = a.createdAt;
						bValue = b.createdAt;
						break;
					case 'updated_at':
						aValue = a.updatedAt || a.createdAt;
						bValue = b.updatedAt || b.createdAt;
						break;
					case 'title':
						aValue = a.name;
						bValue = b.name;
						break;
					case 'description':
						aValue = a.description || '';
						bValue = b.description || '';
						break;
					case 'value':
						aValue = a.value;
						bValue = b.value;
						break;
					case 'isPublic':
						aValue = a.isPublic ? 1 : 0;
						bValue = b.isPublic ? 1 : 0;
						break;
					default:
						return 0;
				}

				const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
				return isDescending ? -comparison : comparison;
			});
		}

		const startIndex = (params.page - 1) * params.pageSize;
		const endIndex = startIndex + params.pageSize;

		return Array.from(authorMap.entries()).map(([, urls]) =>
			AuthorWithUrls.create({
				authorId: urls[0]?.authorId,
				authorName: '',
				authorEmail: '',
				createdAt: urls[0]?.createdAt || new Date(),
				updatedAt: urls[0]?.updatedAt,
				urls: urls.slice(startIndex, endIndex),
			})
		);
	}
}
