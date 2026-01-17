import { beforeEach, describe, expect, it } from 'bun:test';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUrl } from '@/test/factories/make-url';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { LikeUrlUseCase } from './like-url';
import { UnlikeUrlUseCase } from './unlike-url';

let usersRepository: InMemoryUsersRepository;
let urlsRepository: InMemoryUrlsRepository;
let likeUseCase: LikeUrlUseCase;
let sut: UnlikeUrlUseCase;

describe('Unlike URL use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    urlsRepository = new InMemoryUrlsRepository(usersRepository);
    likeUseCase = new LikeUrlUseCase(usersRepository, urlsRepository);
    sut = new UnlikeUrlUseCase(usersRepository, urlsRepository);
  });

  it('should be able to unlike a URL that was previously liked', async () => {
    const user = makeUser();
    const url = makeUrl({ isPublic: true, likes: 0 });

    await usersRepository.create(user);
    await urlsRepository.create(url);

    await likeUseCase.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.urlLikes).toBe(0);
    }
  });

  it('should decrement the URL like count', async () => {
    const user = makeUser();
    const url = makeUrl({ isPublic: true, likes: 5 });

    await usersRepository.create(user);
    await urlsRepository.create(url);

    await likeUseCase.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.urlLikes).toBe(5);
    }

    const updatedUrl = await urlsRepository.findById(url.id.toString());
    expect(updatedUrl?.likes).toBe(5);
  });

  it('should remove URL from author liked list', async () => {
    const user = makeUser();
    const url = makeUrl({ isPublic: true, likes: 0 });

    await usersRepository.create(user);
    await urlsRepository.create(url);

    await likeUseCase.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    let updatedUser = await usersRepository.findById(user.id.toString());
    expect(updatedUser?.urlsLikedList.currentItems).toHaveLength(1);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    updatedUser = await usersRepository.findById(user.id.toString());
    expect(updatedUser?.urlsLikedList.currentItems).toHaveLength(0);
  });

  it('should not be able to unlike a URL that does not exist', async () => {
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

  it('should not be able to unlike a URL if author does not exist', async () => {
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

  it('should not go below zero when unliking a URL without previous likes', async () => {
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
      expect(result.value.urlLikes).toBe(0);
    }

    const updatedUrl = await urlsRepository.findById(url.id.toString());
    expect(updatedUrl?.likes).toBe(0);
  });

  it('should handle multiple authors liking and unliking the same URL', async () => {
    const user1 = makeUser();
    const user2 = makeUser();
    const url = makeUrl({ isPublic: true, likes: 0 });

    await usersRepository.create(user1);
    await usersRepository.create(user2);
    await urlsRepository.create(url);

    await likeUseCase.execute({
      urlId: url.id.toString(),
      authorId: user1.id.toString(),
    });

    await likeUseCase.execute({
      urlId: url.id.toString(),
      authorId: user2.id.toString(),
    });

    let updatedUrl = await urlsRepository.findById(url.id.toString());
    expect(updatedUrl?.likes).toBe(2);

    const result1 = await sut.execute({
      urlId: url.id.toString(),
      authorId: user1.id.toString(),
    });

    expect(result1.isRight()).toBe(true);

    if (result1.isRight()) {
      expect(result1.value.urlLikes).toBe(1);
    }

    updatedUrl = await urlsRepository.findById(url.id.toString());
    expect(updatedUrl?.likes).toBe(1);

    const result2 = await sut.execute({
      urlId: url.id.toString(),
      authorId: user2.id.toString(),
    });

    expect(result2.isRight()).toBe(true);

    if (result2.isRight()) {
      expect(result2.value.urlLikes).toBe(0);
    }

    updatedUrl = await urlsRepository.findById(url.id.toString());
    expect(updatedUrl?.likes).toBe(0);
  });

  it('should allow an author to unlike different URLs', async () => {
    const user = makeUser();
    const url1 = makeUrl({ isPublic: true, likes: 0 });
    const url2 = makeUrl({ isPublic: true, likes: 0 });

    await usersRepository.create(user);
    await urlsRepository.create(url1);
    await urlsRepository.create(url2);

    await likeUseCase.execute({
      urlId: url1.id.toString(),
      authorId: user.id.toString(),
    });

    await likeUseCase.execute({
      urlId: url2.id.toString(),
      authorId: user.id.toString(),
    });

    let updatedUser = await usersRepository.findById(user.id.toString());
    expect(updatedUser?.urlsLikedList.currentItems).toHaveLength(2);

    const result1 = await sut.execute({
      urlId: url1.id.toString(),
      authorId: user.id.toString(),
    });

    expect(result1.isRight()).toBe(true);

    updatedUser = await usersRepository.findById(user.id.toString());
    expect(updatedUser?.urlsLikedList.currentItems).toHaveLength(1);

    const result2 = await sut.execute({
      urlId: url2.id.toString(),
      authorId: user.id.toString(),
    });

    expect(result2.isRight()).toBe(true);

    updatedUser = await usersRepository.findById(user.id.toString());
    expect(updatedUser?.urlsLikedList.currentItems).toHaveLength(0);
  });

  it('should persist the like count decrement to repository', async () => {
    const user = makeUser();
    const url = makeUrl({ isPublic: true, likes: 3 });

    await usersRepository.create(user);
    await urlsRepository.create(url);

    await likeUseCase.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
    });

    const persistedUrl = await urlsRepository.findById(url.id.toString());
    expect(persistedUrl?.likes).toBe(3);
  });
});
