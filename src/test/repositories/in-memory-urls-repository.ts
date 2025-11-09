import type {
	FindManyByAuthorIdParams,
	FindManyParams,
	FindManyWhereIsPublicParams,
	UrlsRepository,
} from '@/domain/url-shortening/application/repositories/urls-repository';
import type { Url } from '@/domain/url-shortening/enterprise/entities/url';
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
		let items = [...this.items];

		// Filter by search (title, description, value)
		if (params.search) {
			const searchLower = params.search.toLowerCase();
			items = items.filter(
				(url) =>
					url.name.toLowerCase().includes(searchLower) ||
					(url.description?.toLowerCase().includes(searchLower) ?? false) ||
					url.value.toLowerCase().includes(searchLower)
			);
		}

		// Filter by isPublic (optional)
		if (params.isPublic !== undefined) {
			items = items.filter((url) => url.isPublic === params.isPublic);
		}

		// Filter by createdAtGte (optional)
		if (params.createdAtGte) {
			const createdAtGte = params.createdAtGte;
			items = items.filter((url) => url.createdAt >= createdAtGte);
		}

		// Filter by updatedAtGte (optional)
		if (params.updatedAtGte) {
			const updatedAtGte = params.updatedAtGte;
			items = items.filter((url) => (url.updatedAt ? url.updatedAt >= updatedAtGte : false));
		}

		const isDescending = params.order?.startsWith('-') ?? false;
		const sortField = isDescending ? params.order?.slice(1) : params.order;

		if (sortField) {
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
		}

		const startIndex = (params.page - 1) * params.pageSize;
		const endIndex = startIndex + params.pageSize;

		return items.slice(startIndex, endIndex);
	}

	async findManyWhereIsPublic(
		params: FindManyWhereIsPublicParams
	): Promise<UrlWithAuthor[]> {
		let items = this.items.filter((item) => item.isPublic);

		// Filter by search (title, description, value)
		if (params.search) {
			const searchLower = params.search.toLowerCase();
			items = items.filter(
				(url) =>
					url.name.toLowerCase().includes(searchLower) ||
					(url.description?.toLowerCase().includes(searchLower) ?? false) ||
					url.value.toLowerCase().includes(searchLower)
			);
		}

		// Filter by createdAtGte (optional)
		if (params.createdAtGte) {
			const createdAtGte = params.createdAtGte;
			items = items.filter((url) => url.createdAt >= createdAtGte);
		}

		// Filter by updatedAtGte (optional)
		if (params.updatedAtGte) {
			const updatedAtGte = params.updatedAtGte;
			items = items.filter((url) => (url.updatedAt ? url.updatedAt >= updatedAtGte : false));
		}

		const isDescending = params.order?.startsWith('-') ?? false;
		const sortField = isDescending ? params.order?.slice(1) : params.order;

		if (sortField) {
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
		}

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
	): Promise<Url[]> {
		const items = [...this.items];

		// Filter by authorId
		let filtered = items.filter((url) => url.authorId.toString() === params.authorId);

		// Filter by search (title, description, value)
		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filtered = filtered.filter(
				(url) =>
					url.name.toLowerCase().includes(searchLower) ||
					(url.description?.toLowerCase().includes(searchLower) ?? false) ||
					url.value.toLowerCase().includes(searchLower)
			);
		}

		// Filter by isPublic (optional)
		if (params.isPublic !== undefined) {
			filtered = filtered.filter((url) => url.isPublic === params.isPublic);
		}

		// Filter by createdAtGte (optional)
		if (params.createdAtGte) {
			const createdAtGte = params.createdAtGte;
			filtered = filtered.filter((url) => url.createdAt >= createdAtGte);
		}

		// Filter by updatedAtGte (optional)
		if (params.updatedAtGte) {
			const updatedAtGte = params.updatedAtGte;
			filtered = filtered.filter((url) => (url.updatedAt ? url.updatedAt >= updatedAtGte : false));
		}

		const isDescending = params.order?.startsWith('-') ?? false;
		const sortField = isDescending ? params.order?.slice(1) : params.order;

		if (sortField) {
			filtered.sort((a, b) => {
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

		return filtered.slice(startIndex, endIndex);
	}
}
