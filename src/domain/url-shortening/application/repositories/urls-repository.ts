import type { Pagination } from '@/core/entities/value-object/pagination';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { Url } from '../../enterprise/entities/url';
import type { UrlWithAuthor } from '../../enterprise/entities/value-object/url-with-author';

export interface FindManyParams extends PaginationParams {
	search?: string;
	isPublic?: boolean;
	createdAtGte?: Date;
	updatedAtGte?: Date;
	order?:
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
	search?: string;
	isPublic?: boolean;
	createdAtGte?: Date;
	updatedAtGte?: Date;
	order?:
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
	authorId: string;
	search?: string;
	isPublic?: boolean;
	createdAtGte?: Date;
	updatedAtGte?: Date;
	order?:
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
	findByCode(code: string): Promise<Url | null>;
	save(url: Url): Promise<Url>;
	delete(urlId: string): Promise<Url | null>;
	findMany(params: FindManyParams): Promise<Pagination<Url>>;
	findManyWhereIsPublic(
		params: FindManyWhereIsPublicParams
	): Promise<Pagination<UrlWithAuthor>>;
	findManyByAuthorId(
		params: FindManyByAuthorIdParams
	): Promise<Pagination<Url>>;
	findManyByIds(ids: string[]): Promise<Array<UrlWithAuthor>>;
}
