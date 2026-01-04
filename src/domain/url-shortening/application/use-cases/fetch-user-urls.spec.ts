import { beforeEach, describe, expect, it } from 'bun:test';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUrl } from '@/test/factories/make-url';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { FetchUserUrlsUseCase } from './fetch-user-urls';

let usersRepository: InMemoryUsersRepository;
let urlsRepository: InMemoryUrlsRepository;

let sut: FetchUserUrlsUseCase;

describe('Fetch user urls use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    urlsRepository = new InMemoryUrlsRepository(usersRepository);
    sut = new FetchUserUrlsUseCase(usersRepository, urlsRepository);
  });

  it('should be able to fetch paginated urls shortener', async () => {
    const user = makeUser();

    await Promise.all(
      Array.from({ length: 50 }, (_, index) => {
        return urlsRepository.create(
          makeUrl({ authorId: index % 5 === 0 ? user.id : undefined })
        );
      })
    );

    await usersRepository.create(user);

    const result = await sut.execute({
      authorId: user.id.toString(),
      params: {
        page: 1,
        perPage: 10,
      },
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const pagination = result.value;

      expect(pagination.page).toBe(1);
      expect(pagination.perPage).toBe(10);
      expect(pagination.totalPages).toBe(1);
      expect(pagination.result).toHaveLength(10);
      expect(pagination.result[0]).toEqual(
        expect.objectContaining({
          authorId: expect.objectContaining({
            value: user.id.toString(),
          }),
        })
      );
    }
  });

  it('should be able to fetch url shortener filtered by isPublic', async () => {
    const user = makeUser();

    await Promise.all(
      Array.from({ length: 20 }, (_, index) => {
        return urlsRepository.create(
          makeUrl({
            authorId: user.id,
            isPublic: index % 2 === 0,
          })
        );
      })
    );

    await usersRepository.create(user);

    const result = await sut.execute({
      authorId: user.id.toString(),
      params: {
        page: 1,
        perPage: 10,
        isPublic: true,
      },
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const pagination = result.value;

      expect(pagination.page).toBe(1);
      expect(pagination.perPage).toBe(10);
      expect(pagination.result).toHaveLength(10);
      expect(pagination.result.every((url) => url.isPublic)).toBe(true);
    }
  });

  it('should be able to fetch url shortener filtered by search term', async () => {
    const user = makeUser();

    await Promise.all([
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'My Important Link',
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'Another Link',
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'Important Document',
        })
      ),
    ]);

    await usersRepository.create(user);

    const result = await sut.execute({
      authorId: user.id.toString(),
      params: {
        page: 1,
        perPage: 10,
        search: 'Important',
      },
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const pagination = result.value;

      expect(pagination.result).toHaveLength(2);
      expect(
        pagination.result.every((url) =>
          url.name.toLowerCase().includes('important')
        )
      ).toBe(true);
    }
  });

  it('should be able to fetch url shortener ordered by created_at descending', async () => {
    const user = makeUser();
    const now = new Date();

    await Promise.all([
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'First URL',
          createdAt: new Date(now.getTime() - 3000),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'Second URL',
          createdAt: new Date(now.getTime() - 2000),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'Third URL',
          createdAt: new Date(now.getTime() - 1000),
        })
      ),
    ]);

    await usersRepository.create(user);

    const result = await sut.execute({
      authorId: user.id.toString(),
      params: {
        page: 1,
        perPage: 10,
        order: '-created_at',
      },
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const pagination = result.value;

      expect(pagination.result).toHaveLength(3);
      expect(pagination.result[0].name).toBe('Third URL');
      expect(pagination.result[1].name).toBe('Second URL');
      expect(pagination.result[2].name).toBe('First URL');
    }
  });

  it('should be able to fetch url shortener ordered by created_at ascending', async () => {
    const user = makeUser();
    const now = new Date();

    await Promise.all([
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'First URL',
          createdAt: new Date(now.getTime() - 3000),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'Second URL',
          createdAt: new Date(now.getTime() - 2000),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'Third URL',
          createdAt: new Date(now.getTime() - 1000),
        })
      ),
    ]);

    await usersRepository.create(user);

    const result = await sut.execute({
      authorId: user.id.toString(),
      params: {
        page: 1,
        perPage: 10,
        order: 'created_at',
      },
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const pagination = result.value;

      expect(pagination.result).toHaveLength(3);
      expect(pagination.result[0].name).toBe('First URL');
      expect(pagination.result[1].name).toBe('Second URL');
      expect(pagination.result[2].name).toBe('Third URL');
    }
  });

  it('should be able to fetch url shortener filtered by createdAtGte', async () => {
    const user = makeUser();
    const baseDate = new Date('2024-01-01');

    await Promise.all([
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'Old URL',
          createdAt: new Date('2023-12-31'),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'New URL 1',
          createdAt: new Date('2024-01-02'),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'New URL 2',
          createdAt: new Date('2024-01-03'),
        })
      ),
    ]);

    await usersRepository.create(user);

    const result = await sut.execute({
      authorId: user.id.toString(),
      params: {
        page: 1,
        perPage: 10,
        createdAtGte: baseDate,
      },
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const pagination = result.value;

      expect(pagination.result).toHaveLength(2);
      expect(pagination.result.every((url) => url.createdAt >= baseDate)).toBe(
        true
      );
    }
  });

  it('should be able to fetch url shortener filtered by updatedAtGte', async () => {
    const user = makeUser();
    const baseDate = new Date('2024-01-01');

    await Promise.all([
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'Old URL',
          updatedAt: new Date('2023-12-31'),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'New URL 1',
          updatedAt: new Date('2024-01-02'),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: user.id,
          name: 'New URL 2',
          updatedAt: new Date('2024-01-03'),
        })
      ),
    ]);

    await usersRepository.create(user);

    const result = await sut.execute({
      authorId: user.id.toString(),
      params: {
        page: 1,
        perPage: 10,
        updatedAtGte: baseDate,
      },
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

  it('should not be able to fetch author urls shortener without author id', async () => {
    const result = await sut.execute({
      authorId: 'non-author',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
