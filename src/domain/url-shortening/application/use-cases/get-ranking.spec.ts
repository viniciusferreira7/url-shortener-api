import { beforeEach, describe, expect, it } from 'bun:test';
import { makeUrl } from '@/test/factories/make-url';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryAnalysisRepository } from '@/test/repositories/in-memory-analysis-repository';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { GetRankingUseCase } from './get-ranking';

let usersRepository: InMemoryUsersRepository;
let urlsRepository: InMemoryUrlsRepository;
let analysisRepository: InMemoryAnalysisRepository;

let sut: GetRankingUseCase;

describe('Get ranking use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    urlsRepository = new InMemoryUrlsRepository(usersRepository);
    analysisRepository = new InMemoryAnalysisRepository();
    sut = new GetRankingUseCase(urlsRepository, analysisRepository);
  });

  it('should be able to get url ranking', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url1 = makeUrl({ authorId: user.id, code: 'url1', isPublic: true });
    const url2 = makeUrl({ authorId: user.id, code: 'url2', isPublic: true });
    const url3 = makeUrl({ authorId: user.id, code: 'url3', isPublic: true });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);
    await urlsRepository.create(url3);

    await analysisRepository.incrementBy('url-ranking', url1.id.toString(), 10);
    await analysisRepository.incrementBy('url-ranking', url2.id.toString(), 25);
    await analysisRepository.incrementBy('url-ranking', url3.id.toString(), 5);

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

  it('should return empty ranking when no URLs are analysisd', async () => {
    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(0);
    }
  });

  it('should limit ranking to top 10 URLs', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const urls = [];
    for (let i = 1; i <= 15; i++) {
      const url = makeUrl({
        authorId: user.id,
        code: `url${i}`,
        isPublic: true,
      });
      await urlsRepository.create(url);
      urls.push(url);
    }

    for (let i = 0; i < urls.length; i++) {
      await analysisRepository.incrementBy(
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
    const user = makeUser();

    await usersRepository.create(user);

    const url1 = makeUrl({ authorId: user.id, code: 'low', isPublic: true });
    const url2 = makeUrl({
      authorId: user.id,
      code: 'high',
      isPublic: true,
    });
    const url3 = makeUrl({
      authorId: user.id,
      code: 'medium',
      isPublic: true,
    });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);
    await urlsRepository.create(url3);

    await analysisRepository.incrementBy('url-ranking', url1.id.toString(), 5);
    await analysisRepository.incrementBy(
      'url-ranking',
      url2.id.toString(),
      100
    );
    await analysisRepository.incrementBy('url-ranking', url3.id.toString(), 50);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking[0].score).toBe(100);
      expect(result.value.ranking[1].score).toBe(50);
      expect(result.value.ranking[2].score).toBe(5);
    }
  });

  it('should include URL details in ranking', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({
      authorId: user.id,
      code: 'test123',
      name: 'Test URL',
      description: 'A test URL for ranking',
      isPublic: true,
    });

    await urlsRepository.create(url);

    await analysisRepository.incrementBy('url-ranking', url.id.toString(), 10);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(1);
      expect(result.value.ranking[0].urlName).toBe('Test URL');
      expect(result.value.ranking[0].urlDescription).toBe(
        'A test URL for ranking'
      );
      expect(result.value.ranking[0].urlIsPublic).toBe(true);
      expect(result.value.ranking[0].authorName).toBe(user.name);
    }
  });

  it('should handle URLs with same score', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url1 = makeUrl({ authorId: user.id, code: 'url1', isPublic: true });
    const url2 = makeUrl({ authorId: user.id, code: 'url2', isPublic: true });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);

    await analysisRepository.incrementBy('url-ranking', url1.id.toString(), 10);
    await analysisRepository.incrementBy('url-ranking', url2.id.toString(), 10);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(2);
      expect(result.value.ranking[0].score).toBe(10);
      expect(result.value.ranking[1].score).toBe(10);
    }
  });

  it('should increment URL score multiple times', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id, code: 'url1', isPublic: true });

    await urlsRepository.create(url);

    await analysisRepository.incrementBy('url-ranking', url.id.toString(), 5);
    await analysisRepository.incrementBy('url-ranking', url.id.toString(), 3);
    await analysisRepository.incrementBy('url-ranking', url.id.toString(), 2);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(1);
      expect(result.value.ranking[0].score).toBe(10);
    }
  });

  it('should handle ranking with multiple authors', async () => {
    const user1 = makeUser({ name: 'Author One' });
    const user2 = makeUser({ name: 'Author Two' });

    await usersRepository.create(user1);
    await usersRepository.create(user2);

    const url1 = makeUrl({
      authorId: user1.id,
      code: 'url1',
      isPublic: true,
    });
    const url2 = makeUrl({
      authorId: user2.id,
      code: 'url2',
      isPublic: true,
    });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);

    await analysisRepository.incrementBy('url-ranking', url1.id.toString(), 20);
    await analysisRepository.incrementBy('url-ranking', url2.id.toString(), 15);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.ranking).toHaveLength(2);
      expect(result.value.ranking[0].authorName).toBe('Author One');
      expect(result.value.ranking[1].authorName).toBe('Author Two');
    }
  });
});
