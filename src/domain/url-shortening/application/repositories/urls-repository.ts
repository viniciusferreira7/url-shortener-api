import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { Url } from '../../enterprise/entities/url';

export interface FindManyParams extends PaginationParams {
	order:
		| 'created_at'
		| 'updated_at'
		| 'title'
		| 'description'
		| 'value'
		| 'isPublic'
		| '-created_at'
		| '-updated_at'
		| '-title'
		| '-description'
		| '-value'
		| '-isPublic';
}

export interface UrlsRepository {
	create(url: Url): Promise<Url>;
	findById(id: string): Promise<Url | null>;
	save(url: Url): Promise<Url>;
	delete(url: Url): Promise<Url>;
	findMany(params: FindManyParams): Promise<Url[]>;
}
