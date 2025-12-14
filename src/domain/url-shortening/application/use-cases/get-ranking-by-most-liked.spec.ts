import { beforeEach, describe, expect, it } from 'bun:test';
import { makeAuthor } from '@/test/factories/make-author';
import { makeUrl } from '@/test/factories/make-url';
import { InMemoryAuthorsRepository } from '@/test/repositories/in-memory-authors-repository';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { GetRankingByMostLikedUseCase } from './get-ranking-by-most-liked';

let authorsRepository: InMemoryAuthorsRepository;
let urlsRepository: InMemoryUrlsRepository;

let sut: GetRankingByMostLikedUseCase;

describe('Get ranking by most liked use case', () => {
  beforeEach(() => {
    authorsRepository = new InMemoryAuthorsRepository();
    urlsRepository = new InMemoryUrlsRepository(authorsRepository);
    sut = new GetRankingByMostLikedUseCase(urlsRepository);
  });

  it('should be able to get ranking by most liked URLs', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url1 = makeUrl({
      authorId: author.id,
      code: 'url1',
      isPublic: true,
      likes: 10,
    });
    const url2 = makeUrl({
      authorId: author.id,
      code: 'url2',
      isPublic: true,
      likes: 25,
    });
    const url3 = makeUrl({
      authorId: author.id,
      code: 'url3',
      isPublic: true,
      likes: 5,
    });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);
    await urlsRepository.create(url3);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(3);
      expect(result.value.ranking[0].urlId.toString()).toBe(url2.id.toString());
      expect(result.value.ranking[1].urlId.toString()).toBe(url1.id.toString());
      expect(result.value.ranking[2].urlId.toString()).toBe(url3.id.toString());
    }
  });

  it('should return empty ranking when no public URLs exist', async () => {
    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(0);
    }
  });

  it('should limit ranking to specified limit', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const urls = [];
    for (let i = 1; i <= 15; i++) {
      const url = makeUrl({
        authorId: author.id,
        code: `url${i}`,
        isPublic: true,
        likes: i,
      });
      await urlsRepository.create(url);
      urls.push(url);
    }

    const result = await sut.execute({ limit: 10 });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(10);

      expect(result.value.ranking[0].urlId.toString()).toBe(
        urls[14].id.toString()
      );

      expect(result.value.ranking[9].urlId.toString()).toBe(
        urls[5].id.toString()
      );
    }
  });

  it('should return ranking sorted by likes in descending order', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url1 = makeUrl({
      authorId: author.id,
      code: 'low',
      isPublic: true,
      likes: 5,
    });
    const url2 = makeUrl({
      authorId: author.id,
      code: 'high',
      isPublic: true,
      likes: 100,
    });
    const url3 = makeUrl({
      authorId: author.id,
      code: 'medium',
      isPublic: true,
      likes: 50,
    });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);
    await urlsRepository.create(url3);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking[0].urlId.toString()).toBe(url2.id.toString());
      expect(result.value.ranking[1].urlId.toString()).toBe(url3.id.toString());
      expect(result.value.ranking[2].urlId.toString()).toBe(url1.id.toString());
    }
  });

  it('should only include public URLs in ranking', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const publicUrl = makeUrl({
      authorId: author.id,
      code: 'public',
      isPublic: true,
      likes: 10,
    });
    const privateUrl = makeUrl({
      authorId: author.id,
      code: 'private',
      isPublic: false,
      likes: 100,
    });

    await urlsRepository.create(publicUrl);
    await urlsRepository.create(privateUrl);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(1);
      expect(result.value.ranking[0].urlId.toString()).toBe(
        publicUrl.id.toString()
      );
    }
  });

  it('should include URL details in ranking', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url = makeUrl({
      authorId: author.id,
      code: 'test123',
      name: 'Test URL',
      description: 'A popular URL',
      isPublic: true,
      likes: 10,
    });

    await urlsRepository.create(url);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(1);
      expect(result.value.ranking[0].urlName).toBe('Test URL');
      expect(result.value.ranking[0].urlDescription).toBe('A popular URL');
      expect(result.value.ranking[0].urlIsPublic).toBe(true);
      expect(result.value.ranking[0].authorName).toBe(author.name);
    }
  });

  it('should handle URLs with same like count', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url1 = makeUrl({
      authorId: author.id,
      code: 'url1',
      isPublic: true,
      likes: 10,
    });
    const url2 = makeUrl({
      authorId: author.id,
      code: 'url2',
      isPublic: true,
      likes: 10,
    });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(2);

      const urlIds = result.value.ranking.map((url) => url.urlId.toString());
      expect(urlIds).toContain(url1.id.toString());
      expect(urlIds).toContain(url2.id.toString());
    }
  });

  it('should handle URLs with zero likes', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url1 = makeUrl({
      authorId: author.id,
      code: 'url1',
      isPublic: true,
      likes: 0,
    });
    const url2 = makeUrl({
      authorId: author.id,
      code: 'url2',
      isPublic: true,
      likes: 5,
    });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(2);
      expect(result.value.ranking[0].urlId.toString()).toBe(url2.id.toString());
      expect(result.value.ranking[1].urlId.toString()).toBe(url1.id.toString());
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
      likes: 20,
    });
    const url2 = makeUrl({
      authorId: author2.id,
      code: 'url2',
      isPublic: true,
      likes: 15,
    });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(2);
      expect(result.value.ranking[0].authorName).toBe('Author One');
      expect(result.value.ranking[1].authorName).toBe('Author Two');
    }
  });

  it('should use default limit of 10 when limit is not specified', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    for (let i = 1; i <= 12; i++) {
      const url = makeUrl({
        authorId: author.id,
        code: `url${i}`,
        isPublic: true,
        likes: i,
      });
      await urlsRepository.create(url);
    }

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(10);
    }
  });

  it('should respect custom limit parameter', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    for (let i = 1; i <= 10; i++) {
      const url = makeUrl({
        authorId: author.id,
        code: `url${i}`,
        isPublic: true,
        likes: i,
      });
      await urlsRepository.create(url);
    }

    const result = await sut.execute({ limit: 5 });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(5);
    }
  });
});
