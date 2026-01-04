import { beforeEach, describe, expect, it } from 'bun:test';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUrl } from '@/test/factories/make-url';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { FetchUserLikedUrlsUseCase } from './fetch-user-liked-urls';

let usersRepository: InMemoryUsersRepository;
let urlsRepository: InMemoryUrlsRepository;
let sut: FetchUserLikedUrlsUseCase;

describe('Fetch user liked URLs use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    urlsRepository = new InMemoryUrlsRepository(usersRepository);
    sut = new FetchUserLikedUrlsUseCase(usersRepository, urlsRepository);
  });

  it('should be able to fetch liked URLs by user', async () => {
    const user = makeUser();
    const url1 = makeUrl({ isPublic: true, name: 'First URL' });
    const url2 = makeUrl({ isPublic: true, name: 'Second URL' });
    const url3 = makeUrl({ isPublic: true, name: 'Third URL' });

    await usersRepository.create(user);
    await urlsRepository.create(url1);
    await urlsRepository.create(url2);
    await urlsRepository.create(url3);

    user.urlsLikedList.add(url1);
    user.urlsLikedList.add(url3);

    await usersRepository.save(user);

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const likedUrls = result.value;

      expect(likedUrls).toHaveLength(2);
      expect(likedUrls[0].urlName).toBe('First URL');
      expect(likedUrls[1].urlName).toBe('Third URL');
    }
  });

  it('should return empty array when user has not liked any URLs', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value).toHaveLength(0);
    }
  });

  it('should return URLs with author information', async () => {
    const user = makeUser();
    const author = makeUser({ name: 'John Doe' });
    const url = makeUrl({ authorId: author.id, isPublic: true });

    await usersRepository.create(user);
    await usersRepository.create(author);
    await urlsRepository.create(url);

    user.urlsLikedList.add(url);
    await usersRepository.save(user);

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const likedUrls = result.value;

      expect(likedUrls).toHaveLength(1);
      expect(likedUrls[0].authorName).toBe('John Doe');
      expect(likedUrls[0].authorId.toString()).toBe(author.id.toString());
    }
  });

  it('should return liked URLs even if they are private', async () => {
    const user = makeUser();
    const author = makeUser();
    const publicUrl = makeUrl({
      authorId: author.id,
      isPublic: true,
      name: 'Public URL',
    });
    const privateUrl = makeUrl({
      authorId: author.id,
      isPublic: false,
      name: 'Private URL',
    });

    await usersRepository.create(user);
    await usersRepository.create(author);
    await urlsRepository.create(publicUrl);
    await urlsRepository.create(privateUrl);

    user.urlsLikedList.add(publicUrl);
    user.urlsLikedList.add(privateUrl);
    await usersRepository.save(user);

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const likedUrls = result.value;

      expect(likedUrls).toHaveLength(2);
      expect(likedUrls.some((url) => url.urlName === 'Private URL')).toBe(true);
    }
  });

  it('should not be able to fetch liked URLs for non-existent user', async () => {
    const result = await sut.execute({
      userId: 'non-existent-user-id',
    });

    expect(result.isLeft()).toBe(true);

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it('should return liked URLs with correct URL properties', async () => {
    const user = makeUser();
    const author = makeUser({ name: 'Author Name' });
    const url = makeUrl({
      authorId: author.id,
      isPublic: true,
      name: 'Test URL',
      description: 'Test Description',
      destinationUrl: 'https://example.com',
      code: 'test-code',
      likes: 5,
    });

    await usersRepository.create(user);
    await usersRepository.create(author);
    await urlsRepository.create(url);

    user.urlsLikedList.add(url);
    await usersRepository.save(user);

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const likedUrls = result.value;

      expect(likedUrls).toHaveLength(1);
      expect(likedUrls[0]).toEqual(
        expect.objectContaining({
          urlName: 'Test URL',
          urlDescription: 'Test Description',
          urlDestination: 'https://example.com',
          urlCode: 'test-code',
          urlLikes: 5,
          authorName: 'Author Name',
        })
      );
    }
  });

  it('should handle multiple users liking different URLs', async () => {
    const user1 = makeUser();
    const user2 = makeUser();
    const author = makeUser();
    const url1 = makeUrl({ authorId: author.id, isPublic: true });
    const url2 = makeUrl({ authorId: author.id, isPublic: true });
    const url3 = makeUrl({ authorId: author.id, isPublic: true });

    await usersRepository.create(user1);
    await usersRepository.create(user2);
    await usersRepository.create(author);
    await urlsRepository.create(url1);
    await urlsRepository.create(url2);
    await urlsRepository.create(url3);

    user1.urlsLikedList.add(url1);
    user1.urlsLikedList.add(url2);
    await usersRepository.save(user1);

    user2.urlsLikedList.add(url2);
    user2.urlsLikedList.add(url3);
    await usersRepository.save(user2);

    const result1 = await sut.execute({
      userId: user1.id.toString(),
    });

    const result2 = await sut.execute({
      userId: user2.id.toString(),
    });

    expect(result1.isRight()).toBe(true);
    expect(result2.isRight()).toBe(true);

    if (result1.isRight() && result2.isRight()) {
      expect(result1.value).toHaveLength(2);
      expect(result2.value).toHaveLength(2);

      expect(result1.value.some((url) => url.urlId.equals(url1.id))).toBe(true);
      expect(result1.value.some((url) => url.urlId.equals(url2.id))).toBe(true);

      expect(result2.value.some((url) => url.urlId.equals(url2.id))).toBe(true);
      expect(result2.value.some((url) => url.urlId.equals(url3.id))).toBe(true);
    }
  });

  it('should return liked URLs from different authors', async () => {
    const user = makeUser();
    const author1 = makeUser({ name: 'Author 1' });
    const author2 = makeUser({ name: 'Author 2' });
    const url1 = makeUrl({ authorId: author1.id, isPublic: true });
    const url2 = makeUrl({ authorId: author2.id, isPublic: true });

    await usersRepository.create(user);
    await usersRepository.create(author1);
    await usersRepository.create(author2);
    await urlsRepository.create(url1);
    await urlsRepository.create(url2);

    user.urlsLikedList.add(url1);
    user.urlsLikedList.add(url2);
    await usersRepository.save(user);

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const likedUrls = result.value;

      expect(likedUrls).toHaveLength(2);
      expect(likedUrls.some((url) => url.authorName === 'Author 1')).toBe(true);
      expect(likedUrls.some((url) => url.authorName === 'Author 2')).toBe(true);
    }
  });
});
