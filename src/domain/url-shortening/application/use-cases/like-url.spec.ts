import { beforeEach, describe, expect, it } from 'bun:test';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUrl } from '@/test/factories/make-url';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { UrlAlreadyLikedError } from '../../errors/url-already-liked-error';
import { LikeUrlUseCase } from './like-url';

let usersRepository: InMemoryUsersRepository;
let urlsRepository: InMemoryUrlsRepository;
let sut: LikeUrlUseCase;

describe('Like URL use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    urlsRepository = new InMemoryUrlsRepository(usersRepository);
    sut = new LikeUrlUseCase(usersRepository, urlsRepository);
  });

  it('should be able to like a public URL', async () => {
    const user = makeUser();
    const url = makeUrl({ isPublic: true, likes: 0 });

    await usersRepository.create(user);
    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.urlLikes).toBe(1);
    }
  });

  it('should not be able to like a private URL', async () => {
    const user = makeUser();
    const url = makeUrl({ isPublic: false, likes: 0 });

    await usersRepository.create(user);
    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError);
    }
  });

  it('should increment the URL like count', async () => {
    const user = makeUser();
    const url = makeUrl({ isPublic: true, likes: 5 });

    await usersRepository.create(user);
    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.urlLikes).toBe(6);
    }

    const updatedUrl = await urlsRepository.findById(url.id.toString());
    expect(updatedUrl?.likes).toBe(6);
  });

  it('should add URL to author liked list', async () => {
    const user = makeUser();
    const url = makeUrl({ isPublic: true, likes: 0 });

    await usersRepository.create(user);
    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    const updatedUser = await usersRepository.findById(user.id.toString());
    expect(updatedUser?.urlsLikedList.currentItems).toContainEqual(url);
  });

  it('should not be able to like a URL that does not exist', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const result = await sut.execute({
      urlId: 'non-existent-id',
      authorId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it('should not be able to like a URL if author does not exist', async () => {
    const url = makeUrl({ isPublic: true, likes: 0 });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: 'non-existent-id',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it('should not be able to like the same URL twice', async () => {
    const user = makeUser();
    const url = makeUrl({ isPublic: true, likes: 0 });

    await usersRepository.create(user);
    await urlsRepository.create(url);

    const firstLike = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    expect(firstLike.isRight()).toBe(true);

    const secondLike = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    expect(secondLike.isLeft()).toBe(true);
    if (secondLike.isLeft()) {
      expect(secondLike.value).toBeInstanceOf(UrlAlreadyLikedError);
    }
  });

  it('should handle multiple authors liking the same URL', async () => {
    const user1 = makeUser();
    const user2 = makeUser();
    const url = makeUrl({ isPublic: true, likes: 0 });

    await usersRepository.create(user1);
    await usersRepository.create(user2);
    await urlsRepository.create(url);

    const result1 = await sut.execute({
      urlId: url.id.toString(),
      authorId: user1.id.toString(),
    });

    const result2 = await sut.execute({
      urlId: url.id.toString(),
      authorId: user2.id.toString(),
    });

    expect(result1.isRight()).toBe(true);
    expect(result2.isRight()).toBe(true);

    if (result1.isRight() && result2.isRight()) {
      expect(result1.value.urlLikes).toBe(1);
      expect(result2.value.urlLikes).toBe(2);
    }

    const updatedUrl = await urlsRepository.findById(url.id.toString());
    expect(updatedUrl?.likes).toBe(2);
  });

  it('should allow an author to like different URLs', async () => {
    const user = makeUser();
    const url1 = makeUrl({ isPublic: true, likes: 0 });
    const url2 = makeUrl({ isPublic: true, likes: 0 });

    await usersRepository.create(user);
    await urlsRepository.create(url1);
    await urlsRepository.create(url2);

    const result1 = await sut.execute({
      urlId: url1.id.toString(),
      authorId: user.id.toString(),
    });

    const result2 = await sut.execute({
      urlId: url2.id.toString(),
      authorId: user.id.toString(),
    });

    expect(result1.isRight()).toBe(true);
    expect(result2.isRight()).toBe(true);

    const updatedUser = await usersRepository.findById(user.id.toString());
    expect(updatedUser?.urlsLikedList.currentItems).toHaveLength(2);
  });

  it('should persist the like count to repository', async () => {
    const user = makeUser();
    const url = makeUrl({ isPublic: true, likes: 3 });

    await usersRepository.create(user);
    await urlsRepository.create(url);

    await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    const persistedUrl = await urlsRepository.findById(url.id.toString());
    expect(persistedUrl?.likes).toBe(4);
  });
});
