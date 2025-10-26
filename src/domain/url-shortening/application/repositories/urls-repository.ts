import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { Url } from '../../enterprise/entities/url';
import type { AuthorWithUrls } from '../../enterprise/entities/value-object/author-with-urls';
import type { UrlWithAuthor } from '../../enterprise/entities/value-object/url-with-author';

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

export interface FindManyWhereIsPublicParams extends PaginationParams {
	order:
		| 'created_at'
		| 'updated_at'
		| 'title'
		| 'description'
		| 'value'
		| '-created_at'
		| '-updated_at'
		| '-title'
		| '-description'
		| '-value';
}

export interface FindManyByAuthorIdParams extends PaginationParams {
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
	findManyWhereIsPublic(
		params: FindManyWhereIsPublicParams
	): Promise<UrlWithAuthor[]>;
	findManyAuthorId(params: FindManyByAuthorIdParams): Promise<AuthorWithUrls[]>;
}
