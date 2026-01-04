import { beforeEach, describe, expect, it } from 'bun:test';
import { makeUrl } from '@/test/factories/make-url';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { FetchManyPublicUrlsUseCase } from './fetch-many-public-urls';

let usersRepository: InMemoryUsersRepository;
let urlsRepository: InMemoryUrlsRepository;

let sut: FetchManyPublicUrlsUseCase;

describe('Fetch many public urls use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    urlsRepository = new InMemoryUrlsRepository(usersRepository);
    sut = new FetchManyPublicUrlsUseCase(urlsRepository);
  });

  describe('Fetch many public URLs', () => {
    it('should be able to fetch paginated public urls shortener', async () => {
      const user = makeUser();

      await usersRepository.create(user);

      await Promise.all(
        Array.from({ length: 50 }, () => {
          return urlsRepository.create(
            makeUrl({ authorId: user.id, isPublic: true })
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
      const user = makeUser();

      await usersRepository.create(user);

      await Promise.all([
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
            name: 'My Important Link',
            isPublic: true,
          })
        ),
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
            name: 'Another Link',
            isPublic: true,
          })
        ),
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
            name: 'Important Document',
            isPublic: true,
          })
        ),
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
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
      const user = makeUser();
      const now = new Date();

      await usersRepository.create(user);

      await Promise.all([
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
            name: 'First URL',
            isPublic: true,
            createdAt: new Date(now.getTime() - 3000),
          })
        ),
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
            name: 'Second URL',
            isPublic: true,
            createdAt: new Date(now.getTime() - 2000),
          })
        ),
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
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
      const user = makeUser();
      const now = new Date();

      await usersRepository.create(user);

      await Promise.all([
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
            name: 'First URL',
            isPublic: true,
            createdAt: new Date(now.getTime() - 3000),
          })
        ),
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
            name: 'Second URL',
            isPublic: true,
            createdAt: new Date(now.getTime() - 2000),
          })
        ),
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
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
      const user = makeUser();
      const baseDate = new Date('2024-01-01');

      await usersRepository.create(user);

      await Promise.all([
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
            name: 'Old URL',
            isPublic: true,
            createdAt: new Date('2023-12-31'),
          })
        ),
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
            name: 'New URL 1',
            isPublic: true,
            createdAt: new Date('2024-01-02'),
          })
        ),
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
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
      const user = makeUser();
      const baseDate = new Date('2024-01-01');

      await usersRepository.create(user);

      await Promise.all([
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
            name: 'Old URL',
            isPublic: true,
            updatedAt: new Date('2023-12-31'),
          })
        ),
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
            name: 'New URL 1',
            isPublic: true,
            updatedAt: new Date('2024-01-02'),
          })
        ),
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
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
      const user = makeUser();

      await usersRepository.create(user);

      await Promise.all([
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
            isPublic: false,
          })
        ),
        urlsRepository.create(
          makeUrl({
            authorId: user.id,
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
      const user = makeUser();

      await usersRepository.create(user);

      await Promise.all(
        Array.from({ length: 25 }, () => {
          return urlsRepository.create(
            makeUrl({ authorId: user.id, isPublic: true })
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
});
