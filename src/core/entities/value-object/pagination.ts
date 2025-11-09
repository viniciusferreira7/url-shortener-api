import { ValueObject } from './value-object';

interface PaginationProps<T> {
	page: number;
	totalPages: number;
	perPage: number;
	result: T[];
}

export class Pagination<Entity> extends ValueObject<PaginationProps<Entity>> {
	public static create<Entity>(
		props: PaginationProps<Entity>
	): Pagination<Entity> {
		return new Pagination(props);
	}
}
