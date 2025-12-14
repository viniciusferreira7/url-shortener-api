import { beforeEach, describe, expect, it } from 'bun:test';
import { makeAuthor } from '@/test/factories/make-author';
import { makeUrl } from '@/test/factories/make-url';
import { InMemoryAuthorsRepository } from '@/test/repositories/in-memory-authors-repository';
import { InMemoryCacheRepository } from '@/test/repositories/in-memory-cache-repository';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { GetRankingUseCase } from './get-ranking';

let authorsRepository: InMemoryAuthorsRepository;
let urlsRepository: InMemoryUrlsRepository;
let cacheRepository: InMemoryCacheRepository;

let sut: GetRankingUseCase;

describe('Get ranking use case', () => {
  beforeEach(() => {
    authorsRepository = new InMemoryAuthorsRepository();
    urlsRepository = new InMemoryUrlsRepository(authorsRepository);
    cacheRepository = new InMemoryCacheRepository();
    sut = new GetRankingUseCase(urlsRepository, cacheRepository);
  });

  it('should be able to get url ranking', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url1 = makeUrl({ authorId: author.id, code: 'url1', isPublic: true });
    const url2 = makeUrl({ authorId: author.id, code: 'url2', isPublic: true });
    const url3 = makeUrl({ authorId: author.id, code: 'url3', isPublic: true });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);
    await urlsRepository.create(url3);

    await cacheRepository.incrementBy('url-ranking', url1.id.toString(), 10);
    await cacheRepository.incrementBy('url-ranking', url2.id.toString(), 25);
    await cacheRepository.incrementBy('url-ranking', url3.id.toString(), 5);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(3);
      expect(result.value.ranking[0].urlId.toString()).toBe(url2.id.toString());
      expect(result.value.ranking[0].score).toBe(25);
      expect(result.value.ranking[1].urlId.toString()).toBe(url1.id.toString());
      expect(result.value.ranking[1].score).toBe(10);
      expect(result.value.ranking[2].urlId.toString()).toBe(url3.id.toString());
      expect(result.value.ranking[2].score).toBe(5);
    }
  });

  it('should return empty ranking when no URLs are cached', async () => {
    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(0);
    }
  });

  it('should limit ranking to top 10 URLs', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const urls = [];
    for (let i = 1; i <= 15; i++) {
      const url = makeUrl({
        authorId: author.id,
        code: `url${i}`,
        isPublic: true,
      });
      await urlsRepository.create(url);
      urls.push(url);
    }

    for (let i = 0; i < urls.length; i++) {
      await cacheRepository.incrementBy(
        'url-ranking',
        urls[i].id.toString(),
        i + 1
      );
    }

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(10);
      expect(result.value.ranking[0].score).toBe(15);
      expect(result.value.ranking[9].score).toBe(6);
    }
  });

  it('should return ranking sorted by score in descending order', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url1 = makeUrl({ authorId: author.id, code: 'low', isPublic: true });
    const url2 = makeUrl({
      authorId: author.id,
      code: 'high',
      isPublic: true,
    });
    const url3 = makeUrl({
      authorId: author.id,
      code: 'medium',
      isPublic: true,
    });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);
    await urlsRepository.create(url3);

    await cacheRepository.incrementBy('url-ranking', url1.id.toString(), 5);
    await cacheRepository.incrementBy('url-ranking', url2.id.toString(), 100);
    await cacheRepository.incrementBy('url-ranking', url3.id.toString(), 50);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking[0].score).toBe(100);
      expect(result.value.ranking[1].score).toBe(50);
      expect(result.value.ranking[2].score).toBe(5);
    }
  });

  it('should include URL details in ranking', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url = makeUrl({
      authorId: author.id,
      code: 'test123',
      name: 'Test URL',
      description: 'A test URL for ranking',
      isPublic: true,
    });

    await urlsRepository.create(url);

    await cacheRepository.incrementBy('url-ranking', url.id.toString(), 10);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(1);
      expect(result.value.ranking[0].urlName).toBe('Test URL');
      expect(result.value.ranking[0].urlDescription).toBe(
        'A test URL for ranking'
      );
      expect(result.value.ranking[0].urlIsPublic).toBe(true);
      expect(result.value.ranking[0].authorName).toBe(author.name);
    }
  });

  it('should handle URLs with same score', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url1 = makeUrl({ authorId: author.id, code: 'url1', isPublic: true });
    const url2 = makeUrl({ authorId: author.id, code: 'url2', isPublic: true });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);

    await cacheRepository.incrementBy('url-ranking', url1.id.toString(), 10);
    await cacheRepository.incrementBy('url-ranking', url2.id.toString(), 10);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(2);
      expect(result.value.ranking[0].score).toBe(10);
      expect(result.value.ranking[1].score).toBe(10);
    }
  });

  it('should increment URL score multiple times', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url = makeUrl({ authorId: author.id, code: 'url1', isPublic: true });

    await urlsRepository.create(url);

    await cacheRepository.incrementBy('url-ranking', url.id.toString(), 5);
    await cacheRepository.incrementBy('url-ranking', url.id.toString(), 3);
    await cacheRepository.incrementBy('url-ranking', url.id.toString(), 2);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(1);
      expect(result.value.ranking[0].score).toBe(10);
    }
  });

  it('should handle ranking with multiple authors', async () => {
    const author1 = makeAuthor({ name: 'Author One' });
    const author2 = makeAuthor({ name: 'Author Two' });

    await authorsRepository.create(author1);
    await authorsRepository.create(author2);

    const url1 = makeUrl({
      authorId: author1.id,
      code: 'url1',
      isPublic: true,
    });
    const url2 = makeUrl({
      authorId: author2.id,
      code: 'url2',
      isPublic: true,
    });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);

    await cacheRepository.incrementBy('url-ranking', url1.id.toString(), 20);
    await cacheRepository.incrementBy('url-ranking', url2.id.toString(), 15);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(2);
      expect(result.value.ranking[0].authorName).toBe('Author One');
      expect(result.value.ranking[1].authorName).toBe('Author Two');
    }
  });
});
