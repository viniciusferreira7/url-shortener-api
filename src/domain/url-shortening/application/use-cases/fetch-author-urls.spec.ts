import { beforeEach, describe, expect, it } from 'bun:test';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeAuthor } from '@/test/factories/make-author';
import { makeUrl } from '@/test/factories/make-url';
import { InMemoryAuthorsRepository } from '@/test/repositories/in-memory-authors-repository';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { FetchAuthorUrlsUseCase } from './fetch-author-urls';

let authorsRepository: InMemoryAuthorsRepository;
let urlsRepository: InMemoryUrlsRepository;

let sut: FetchAuthorUrlsUseCase;

describe('Fetch author urls use case', () => {
  beforeEach(() => {
    authorsRepository = new InMemoryAuthorsRepository();
    urlsRepository = new InMemoryUrlsRepository(authorsRepository);
    sut = new FetchAuthorUrlsUseCase(authorsRepository, urlsRepository);
  });

  it('should be able to fetch paginated urls shortener', async () => {
    const author = makeAuthor();

    await Promise.all(
      Array.from({ length: 50 }, (_, index) => {
        return urlsRepository.create(
          makeUrl({ authorId: index % 5 === 0 ? author.id : undefined })
        );
      })
    );

    await authorsRepository.create(author);

    const result = await sut.execute({
      authorId: author.id.toString(),
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
            value: author.id.toString(),
          }),
        })
      );
    }
  });

  it('should be able to fetch url shortener filtered by isPublic', async () => {
    const author = makeAuthor();

    await Promise.all(
      Array.from({ length: 20 }, (_, index) => {
        return urlsRepository.create(
          makeUrl({
            authorId: author.id,
            isPublic: index % 2 === 0,
          })
        );
      })
    );

    await authorsRepository.create(author);

    const result = await sut.execute({
      authorId: author.id.toString(),
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
    const author = makeAuthor();

    await Promise.all([
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'My Important Link',
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'Another Link',
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'Important Document',
        })
      ),
    ]);

    await authorsRepository.create(author);

    const result = await sut.execute({
      authorId: author.id.toString(),
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
    const author = makeAuthor();
    const now = new Date();

    await Promise.all([
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'First URL',
          createdAt: new Date(now.getTime() - 3000),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'Second URL',
          createdAt: new Date(now.getTime() - 2000),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'Third URL',
          createdAt: new Date(now.getTime() - 1000),
        })
      ),
    ]);

    await authorsRepository.create(author);

    const result = await sut.execute({
      authorId: author.id.toString(),
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
    const author = makeAuthor();
    const now = new Date();

    await Promise.all([
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'First URL',
          createdAt: new Date(now.getTime() - 3000),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'Second URL',
          createdAt: new Date(now.getTime() - 2000),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'Third URL',
          createdAt: new Date(now.getTime() - 1000),
        })
      ),
    ]);

    await authorsRepository.create(author);

    const result = await sut.execute({
      authorId: author.id.toString(),
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
    const author = makeAuthor();
    const baseDate = new Date('2024-01-01');

    await Promise.all([
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'Old URL',
          createdAt: new Date('2023-12-31'),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'New URL 1',
          createdAt: new Date('2024-01-02'),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'New URL 2',
          createdAt: new Date('2024-01-03'),
        })
      ),
    ]);

    await authorsRepository.create(author);

    const result = await sut.execute({
      authorId: author.id.toString(),
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
    const author = makeAuthor();
    const baseDate = new Date('2024-01-01');

    await Promise.all([
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'Old URL',
          updatedAt: new Date('2023-12-31'),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'New URL 1',
          updatedAt: new Date('2024-01-02'),
        })
      ),
      urlsRepository.create(
        makeUrl({
          authorId: author.id,
          name: 'New URL 2',
          updatedAt: new Date('2024-01-03'),
        })
      ),
    ]);

    await authorsRepository.create(author);

    const result = await sut.execute({
      authorId: author.id.toString(),
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
