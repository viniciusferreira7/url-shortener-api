import { beforeEach, describe, expect, it } from 'bun:test';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUrl } from '@/test/factories/make-url';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { GetUrlByIdUseCase } from './get-url-by-id';

let usersRepository: InMemoryUsersRepository;
let urlsRepository: InMemoryUrlsRepository;

let sut: GetUrlByIdUseCase;

describe('Get url by ID use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    urlsRepository = new InMemoryUrlsRepository(usersRepository);
    sut = new GetUrlByIdUseCase(urlsRepository);
  });

  it('should be able to get url by id', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.id.toString()).toBe(url.id.toString());
      expect(result.value.url.name).toBe(url.name);
      expect(result.value.url.destinationUrl).toBe(url.destinationUrl);
      expect(result.value.url.code).toBe(url.code);
      expect(result.value.url.isPublic).toBe(url.isPublic);
    }
  });

  it('should be able to get public url by id', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id, isPublic: true });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.isPublic).toBe(true);
    }
  });

  it('should be able to get private url by id', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id, isPublic: false });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.isPublic).toBe(false);
    }
  });

  it('should return ResourceNotFoundError when url does not exist', async () => {
    const result = await sut.execute({
      urlId: 'non-existent-url',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should return ResourceNotFoundError when url id is invalid format', async () => {
    const result = await sut.execute({
      urlId: 'invalid-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should return correct url data with all properties', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({
      authorId: user.id,
      name: 'My Test URL',
      description: 'This is a test URL',
      isPublic: true,
    });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const retrievedUrl = result.value.url;
      expect(retrievedUrl.name).toBe('My Test URL');
      expect(retrievedUrl.description).toBe('This is a test URL');
      expect(retrievedUrl.isPublic).toBe(true);
      expect(retrievedUrl.authorId.toString()).toBe(user.id.toString());
      expect(retrievedUrl.createdAt).toBeInstanceOf(Date);
      expect(retrievedUrl.likes).toBe(0);
    }
  });

  it('should retrieve url even after update', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id, name: 'Original Name' });

    await urlsRepository.create(url);

    url.name = 'Updated Name';
    url.updatedAt = new Date();
    await urlsRepository.save(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.name).toBe('Updated Name');
    }
  });

  it('should return null when url has been deleted', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id });

    await urlsRepository.create(url);

    await urlsRepository.delete(url.id.toString());

    const result = await sut.execute({
      urlId: url.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
