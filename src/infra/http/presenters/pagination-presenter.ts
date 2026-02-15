export interface Pagination<T> {
  page: number;
  totalPages: number;
  perPage: number;
  result: T[];
}

export class PaginationPresenter {
  static toHttp<T, R>(data: Pagination<T>, itemMapper: (item: T) => R) {
    return {
      page: data.page,
      total_pages: data.totalPages,
      per_page: data.perPage,
      result: data.result.map(itemMapper),
    };
  }
}
