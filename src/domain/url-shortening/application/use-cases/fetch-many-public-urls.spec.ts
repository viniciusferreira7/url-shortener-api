import { beforeEach, describe, expect, it } from 'bun:test';
import { makeAuthor } from '@/test/factories/make-author';
import { makeUrl } from '@/test/factories/make-url';
import { InMemoryAuthorsRepository } from '@/test/repositories/in-memory-authors-repository';
import { InMemoryCacheRepository } from '@/test/repositories/in-memory-cache-repository';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { FetchManyPublicUrlsUseCase } from './fetch-many-public-urls';

let authorsRepository: InMemoryAuthorsRepository;
let urlsRepository: InMemoryUrlsRepository;
let cacheRepository: InMemoryCacheRepository;

let sut: FetchManyPublicUrlsUseCase;
let sutWithCache: FetchManyPublicUrlsUseCase;

describe('Fetch many public urls use case', () => {
	beforeEach(() => {
		authorsRepository = new InMemoryAuthorsRepository();
		urlsRepository = new InMemoryUrlsRepository(authorsRepository);
		cacheRepository = new InMemoryCacheRepository();
		sut = new FetchManyPublicUrlsUseCase(urlsRepository, cacheRepository);
		sutWithCache = new FetchManyPublicUrlsUseCase(
			urlsRepository,
			cacheRepository
		);
	});

	describe('without cache invalidation', () => {
		it('should be able to fetch paginated public urls shortener', async () => {
			const author = makeAuthor();

			await authorsRepository.create(author);

			await Promise.all(
				Array.from({ length: 50 }, () => {
					return urlsRepository.create(
						makeUrl({ authorId: author.id, isPublic: true })
					);
				})
			);

			const result = await sut.execute({
				page: 1,
				perPage: 10,
			});

			expect(result.isRight()).toBe(true);

			if (result.isRight()) {
				const pagination = result.value;

				expect(pagination.page).toBe(1);
				expect(pagination.perPage).toBe(10);
				expect(pagination.totalPages).toBe(5);
				expect(pagination.result).toHaveLength(10);
				expect(pagination.result.every((url) => url.urlIsPublic)).toBe(true);
			}
		});

		it('should be able to fetch public urls with search term', async () => {
			const author = makeAuthor();

			await authorsRepository.create(author);

			await Promise.all([
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'My Important Link',
						isPublic: true,
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'Another Link',
						isPublic: true,
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'Important Document',
						isPublic: true,
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'Private Link',
						isPublic: false,
					})
				),
			]);

			const result = await sut.execute({
				search: 'Important',
				page: 1,
				perPage: 10,
			});

			expect(result.isRight()).toBe(true);

			if (result.isRight()) {
				const pagination = result.value;

				expect(pagination.result).toHaveLength(2);
				expect(
					pagination.result.every((url) =>
						url.urlName.toLowerCase().includes('important')
					)
				).toBe(true);
				expect(pagination.result.every((url) => url.urlIsPublic)).toBe(true);
			}
		});

		it('should be able to fetch public urls ordered by created_at descending', async () => {
			const author = makeAuthor();
			const now = new Date();

			await authorsRepository.create(author);

			await Promise.all([
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'First URL',
						isPublic: true,
						createdAt: new Date(now.getTime() - 3000),
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'Second URL',
						isPublic: true,
						createdAt: new Date(now.getTime() - 2000),
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'Third URL',
						isPublic: true,
						createdAt: new Date(now.getTime() - 1000),
					})
				),
			]);

			const result = await sut.execute({
				page: 1,
				perPage: 10,
				order: '-created_at' as const,
			});

			expect(result.isRight()).toBe(true);

			if (result.isRight()) {
				const pagination = result.value;

				expect(pagination.result).toHaveLength(3);
				expect(pagination.result[0].urlName).toBe('Third URL');
				expect(pagination.result[1].urlName).toBe('Second URL');
				expect(pagination.result[2].urlName).toBe('First URL');
			}
		});

		it('should be able to fetch public urls ordered by created_at ascending', async () => {
			const author = makeAuthor();
			const now = new Date();

			await authorsRepository.create(author);

			await Promise.all([
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'First URL',
						isPublic: true,
						createdAt: new Date(now.getTime() - 3000),
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'Second URL',
						isPublic: true,
						createdAt: new Date(now.getTime() - 2000),
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'Third URL',
						isPublic: true,
						createdAt: new Date(now.getTime() - 1000),
					})
				),
			]);

			const result = await sut.execute({
				page: 1,
				perPage: 10,
				order: 'created_at' as const,
			});

			expect(result.isRight()).toBe(true);

			if (result.isRight()) {
				const pagination = result.value;

				expect(pagination.result).toHaveLength(3);
				expect(pagination.result[0].urlName).toBe('First URL');
				expect(pagination.result[1].urlName).toBe('Second URL');
				expect(pagination.result[2].urlName).toBe('Third URL');
			}
		});

		it('should be able to fetch public urls filtered by createdAtGte', async () => {
			const author = makeAuthor();
			const baseDate = new Date('2024-01-01');

			await authorsRepository.create(author);

			await Promise.all([
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'Old URL',
						isPublic: true,
						createdAt: new Date('2023-12-31'),
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'New URL 1',
						isPublic: true,
						createdAt: new Date('2024-01-02'),
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'New URL 2',
						isPublic: true,
						createdAt: new Date('2024-01-03'),
					})
				),
			]);

			const result = await sut.execute({
				page: 1,
				perPage: 10,
				createdAtGte: baseDate,
			});

			expect(result.isRight()).toBe(true);

			if (result.isRight()) {
				const pagination = result.value;

				expect(pagination.result).toHaveLength(2);
				expect(
					pagination.result.every((url) => url.createdAt >= baseDate)
				).toBe(true);
			}
		});

		it('should be able to fetch public urls filtered by updatedAtGte', async () => {
			const author = makeAuthor();
			const baseDate = new Date('2024-01-01');

			await authorsRepository.create(author);

			await Promise.all([
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'Old URL',
						isPublic: true,
						updatedAt: new Date('2023-12-31'),
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'New URL 1',
						isPublic: true,
						updatedAt: new Date('2024-01-02'),
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						name: 'New URL 2',
						isPublic: true,
						updatedAt: new Date('2024-01-03'),
					})
				),
			]);

			const result = await sut.execute({
				page: 1,
				perPage: 10,
				updatedAtGte: baseDate,
			});

			expect(result.isRight()).toBe(true);

			if (result.isRight()) {
				const pagination = result.value;

				expect(pagination.result).toHaveLength(2);
				expect(
					pagination.result.every(
						(url) => !url.updatedAt || url.updatedAt >= baseDate
					)
				).toBe(true);
			}
		});

		it('should return empty result when no public urls exist', async () => {
			const author = makeAuthor();

			await authorsRepository.create(author);

			await Promise.all([
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						isPublic: false,
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						isPublic: false,
					})
				),
			]);

			const result = await sut.execute({
				page: 1,
				perPage: 10,
			});

			expect(result.isRight()).toBe(true);

			if (result.isRight()) {
				const pagination = result.value;

				expect(pagination.result).toHaveLength(0);
				expect(pagination.totalPages).toBe(0);
			}
		});

		it('should handle pagination correctly for public urls', async () => {
			const author = makeAuthor();

			await authorsRepository.create(author);

			await Promise.all(
				Array.from({ length: 25 }, () => {
					return urlsRepository.create(
						makeUrl({ authorId: author.id, isPublic: true })
					);
				})
			);

			const resultPage1 = await sut.execute({
				page: 1,
				perPage: 10,
			});

			const resultPage2 = await sut.execute({
				page: 2,
				perPage: 10,
			});

			const resultPage3 = await sut.execute({
				page: 3,
				perPage: 10,
			});

			expect(resultPage1.isRight()).toBe(true);
			expect(resultPage2.isRight()).toBe(true);
			expect(resultPage3.isRight()).toBe(true);

			if (
				resultPage1.isRight() &&
				resultPage2.isRight() &&
				resultPage3.isRight()
			) {
				expect(resultPage1.value.result).toHaveLength(10);
				expect(resultPage2.value.result).toHaveLength(10);
				expect(resultPage3.value.result).toHaveLength(5);
				expect(resultPage1.value.totalPages).toBe(3);
				expect(resultPage2.value.totalPages).toBe(3);
				expect(resultPage3.value.totalPages).toBe(3);
			}
		});
	});

	describe('with cache invalidation', () => {
		it('should cache results for the same request parameters', async () => {
			const author = makeAuthor();

			await authorsRepository.create(author);

			await Promise.all([
				urlsRepository.create(
					makeUrl({ authorId: author.id, isPublic: true, name: 'URL 1' })
				),
				urlsRepository.create(
					makeUrl({ authorId: author.id, isPublic: true, name: 'URL 2' })
				),
			]);

			sutWithCache.resetFetchCount();

			const firstCall = await sutWithCache.execute({
				page: 1,
				perPage: 10,
			});

			expect(firstCall.isRight()).toBe(true);
			expect(sutWithCache.getFetchCount()).toBe(1);

			const secondCall = await sutWithCache.execute({
				page: 1,
				perPage: 10,
			});

			expect(secondCall.isRight()).toBe(true);
			expect(sutWithCache.getFetchCount()).toBe(1);

			if (firstCall.isRight() && secondCall.isRight()) {
				expect(firstCall.value.result).toEqual(secondCall.value.result);
			}
		});

		it('should not cache results for different page numbers', async () => {
			const author = makeAuthor();

			await authorsRepository.create(author);

			await Promise.all(
				Array.from({ length: 25 }, () => {
					return urlsRepository.create(
						makeUrl({ authorId: author.id, isPublic: true })
					);
				})
			);

			sutWithCache.resetFetchCount();

			const page1 = await sutWithCache.execute({
				page: 1,
				perPage: 10,
			});

			const page2 = await sutWithCache.execute({
				page: 2,
				perPage: 10,
			});

			expect(page1.isRight()).toBe(true);
			expect(page2.isRight()).toBe(true);
			expect(sutWithCache.getFetchCount()).toBe(2);

			if (page1.isRight() && page2.isRight()) {
				expect(page1.value.result[0].urlId).not.toBe(
					page2.value.result[0].urlId
				);
			}
		});

		it('should not cache results for different search terms', async () => {
			const author = makeAuthor();

			await authorsRepository.create(author);

			await Promise.all([
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						isPublic: true,
						name: 'Important Link',
					})
				),
				urlsRepository.create(
					makeUrl({ authorId: author.id, isPublic: true, name: 'Other Link' })
				),
			]);

			sutWithCache.resetFetchCount();

			const searchImportant = await sutWithCache.execute({
				search: 'Important',
				page: 1,
				perPage: 10,
			});

			const searchOther = await sutWithCache.execute({
				search: 'Other',
				page: 1,
				perPage: 10,
			});

			expect(searchImportant.isRight()).toBe(true);
			expect(searchOther.isRight()).toBe(true);
			expect(sutWithCache.getFetchCount()).toBe(2);
		});

		it('should invalidate cache when invalidateCache is called', async () => {
			const author = makeAuthor();

			await authorsRepository.create(author);

			await urlsRepository.create(
				makeUrl({ authorId: author.id, isPublic: true })
			);

			sutWithCache.resetFetchCount();

			const firstCall = await sutWithCache.execute({
				page: 1,
				perPage: 10,
			});

			expect(firstCall.isRight()).toBe(true);
			expect(sutWithCache.getFetchCount()).toBe(1);

			await sutWithCache.invalidateCache();

			const secondCall = await sutWithCache.execute({
				page: 1,
				perPage: 10,
			});

			expect(secondCall.isRight()).toBe(true);
			expect(sutWithCache.getFetchCount()).toBe(2);
		});

		it('should not cache results for different sort orders', async () => {
			const author = makeAuthor();
			const now = new Date();

			await authorsRepository.create(author);

			await Promise.all([
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						isPublic: true,
						name: 'First URL',
						createdAt: new Date(now.getTime() - 2000),
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						isPublic: true,
						name: 'Second URL',
						createdAt: new Date(now.getTime() - 1000),
					})
				),
			]);

			sutWithCache.resetFetchCount();

			const ascending = await sutWithCache.execute({
				order: 'created_at' as const,
				page: 1,
				perPage: 10,
			});

			const descending = await sutWithCache.execute({
				order: '-created_at' as const,
				page: 1,
				perPage: 10,
			});

			expect(ascending.isRight()).toBe(true);
			expect(descending.isRight()).toBe(true);
			expect(sutWithCache.getFetchCount()).toBe(2);

			if (ascending.isRight() && descending.isRight()) {
				expect(ascending.value.result[0].urlName).toBe('First URL');
				expect(descending.value.result[0].urlName).toBe('Second URL');
			}
		});

		it('should cache results for requests with the same filters', async () => {
			const author = makeAuthor();
			const baseDate = new Date('2024-01-01');

			await authorsRepository.create(author);

			await Promise.all([
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						isPublic: true,
						createdAt: new Date('2024-01-02'),
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						isPublic: true,
						createdAt: new Date('2023-12-31'),
					})
				),
			]);

			sutWithCache.resetFetchCount();

			const firstCall = await sutWithCache.execute({
				createdAtGte: baseDate,
				page: 1,
				perPage: 10,
			});

			expect(firstCall.isRight()).toBe(true);
			expect(sutWithCache.getFetchCount()).toBe(1);

			const secondCall = await sutWithCache.execute({
				createdAtGte: baseDate,
				page: 1,
				perPage: 10,
			});

			expect(secondCall.isRight()).toBe(true);
			expect(sutWithCache.getFetchCount()).toBe(1);

			if (firstCall.isRight() && secondCall.isRight()) {
				expect(firstCall.value.result).toEqual(secondCall.value.result);
			}
		});

		it('should handle multiple cache entries independently', async () => {
			const author = makeAuthor();

			await authorsRepository.create(author);

			await Promise.all(
				Array.from({ length: 30 }, () => {
					return urlsRepository.create(
						makeUrl({ authorId: author.id, isPublic: true })
					);
				})
			);

			sutWithCache.resetFetchCount();

			const page1 = await sutWithCache.execute({
				page: 1,
				perPage: 10,
			});

			const page2 = await sutWithCache.execute({
				page: 2,
				perPage: 10,
			});

			const page1Again = await sutWithCache.execute({
				page: 1,
				perPage: 10,
			});

			expect(page1.isRight()).toBe(true);
			expect(page2.isRight()).toBe(true);
			expect(page1Again.isRight()).toBe(true);
			expect(sutWithCache.getFetchCount()).toBe(2);

			if (page1.isRight() && page1Again.isRight()) {
				expect(page1.value.result).toEqual(page1Again.value.result);
			}
		});

		it('should cache with search, sort, and filter combination', async () => {
			const author = makeAuthor();
			const baseDate = new Date('2024-01-01');

			await authorsRepository.create(author);

			await Promise.all([
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						isPublic: true,
						name: 'Important Doc 1',
						createdAt: new Date('2024-01-02'),
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						isPublic: true,
						name: 'Important Doc 2',
						createdAt: new Date('2024-01-03'),
					})
				),
				urlsRepository.create(
					makeUrl({
						authorId: author.id,
						isPublic: true,
						name: 'Other Link',
						createdAt: new Date('2024-01-04'),
					})
				),
			]);

			sutWithCache.resetFetchCount();

			const firstCall = await sutWithCache.execute({
				search: 'Important',
				order: 'created_at' as const,
				createdAtGte: baseDate,
				page: 1,
				perPage: 10,
			});

			expect(firstCall.isRight()).toBe(true);
			expect(sutWithCache.getFetchCount()).toBe(1);

			const secondCall = await sutWithCache.execute({
				search: 'Important',
				order: 'created_at' as const,
				createdAtGte: baseDate,
				page: 1,
				perPage: 10,
			});

			expect(secondCall.isRight()).toBe(true);
			expect(sutWithCache.getFetchCount()).toBe(1);

			if (firstCall.isRight() && secondCall.isRight()) {
				expect(firstCall.value.result).toEqual(secondCall.value.result);
				expect(firstCall.value.result).toHaveLength(2);
			}
		});
	});
});
