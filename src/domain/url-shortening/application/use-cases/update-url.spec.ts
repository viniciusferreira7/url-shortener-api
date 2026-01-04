import { beforeEach, describe, expect, it } from 'bun:test';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUrl } from '@/test/factories/make-url';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { UpdateUrlUseCase } from './update-url';

let usersRepository: InMemoryUsersRepository;
let urlsRepository: InMemoryUrlsRepository;

let sut: UpdateUrlUseCase;

describe('Update url use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    urlsRepository = new InMemoryUrlsRepository(usersRepository);
    sut = new UpdateUrlUseCase(usersRepository, urlsRepository);
  });

  it('should be able to update url shortener name', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
      name: 'Updated URL Name',
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.name).toBe('Updated URL Name');
      expect(result.value.url.destinationUrl).toBe(url.destinationUrl);
      expect(result.value.url.updatedAt).toBeTruthy();
    }
  });

  it('should be able to update url shortener value', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id });

    await urlsRepository.create(url);

    const newValue = 'https://example.com/new-path';

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
      destinationUrl: newValue,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.destinationUrl).toBe(newValue);
      expect(result.value.url.name).toBe(url.name);
    }
  });

  it('should be able to update url shortener description', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id });

    await urlsRepository.create(url);

    const newDescription = 'Updated description';

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
      description: newDescription,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.description).toBe(newDescription);
    }
  });

  it('should be able to update url shortener isPublic', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id, isPublic: false });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
      isPublic: true,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.isPublic).toBe(true);
    }
  });

  it('should be able to update url shortener with multiple fields', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id, isPublic: false });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
      name: 'New Name',
      destinationUrl: 'https://example.com/new',
      description: 'New description',
      isPublic: true,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.name).toBe('New Name');
      expect(result.value.url.destinationUrl).toBe('https://example.com/new');
      expect(result.value.url.description).toBe('New description');
      expect(result.value.url.isPublic).toBe(true);
    }
  });

  it('should be able to clear url shortener description', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({
      authorId: user.id,
      description: 'Some description',
    });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
      description: null,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.description).toBeNull();
    }
  });

  it('should not be able to update url shortener without author', async () => {
    const user = makeUser();
    const url = makeUrl({ authorId: user.id });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: 'non-author',
      name: 'Updated Name',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to update url shortener that does not exist', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const result = await sut.execute({
      urlId: 'non-existent-url',
      authorId: user.id.toString(),
      name: 'Updated Name',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to update url shortener from another author', async () => {
    const user1 = makeUser();
    const user2 = makeUser();

    await usersRepository.create(user1);
    await usersRepository.create(user2);

    const url = makeUrl({ authorId: user1.id });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user2.id.toString(),
      name: 'Updated Name',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should update url shortener timestamp when modified', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id });

    await urlsRepository.create(url);

    const originalUpdatedAt = url.updatedAt;

    await new Promise((resolve) => setTimeout(resolve, 10));

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
      name: 'Updated Name',
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const updatedUrl = result.value.url;
      expect(updatedUrl.updatedAt).not.toEqual(originalUpdatedAt);
      expect(updatedUrl.updatedAt).toBeInstanceOf(Date);
      expect(updatedUrl.updatedAt?.getTime()).toBeGreaterThan(
        originalUpdatedAt?.getTime() ?? 0
      );
    }
  });

  it('should persist updates to repository', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: user.id.toString(),
      name: 'Updated Name',
      destinationUrl: 'https://updated.example.com',
    });

    expect(result.isRight()).toBe(true);

    const savedUrl = await urlsRepository.findById(url.id.toString());

    expect(savedUrl).toBeTruthy();
    expect(savedUrl?.name).toBe('Updated Name');
    expect(savedUrl?.destinationUrl).toBe('https://updated.example.com');
  });
});
