import { beforeEach, describe, expect, it } from 'bun:test';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUrl } from '@/test/factories/make-url';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { DeleteUrlUseCase } from './delete-url';

let usersRepository: InMemoryUsersRepository;
let urlsRepository: InMemoryUrlsRepository;

let sut: DeleteUrlUseCase;

describe('Delete url use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    urlsRepository = new InMemoryUrlsRepository(usersRepository);
    sut = new DeleteUrlUseCase(usersRepository, urlsRepository);
  });

  it('should be able to delete url shortener', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl({ authorId: user.id });

    await urlsRepository.create(url);

    const result = await sut.execute({
      authorId: user.id.toString(),
      urlId: url.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        url: expect.objectContaining({
          authorId: user.id,
          name: url.name,
          destinationUrl: url.destinationUrl,
          description: url.description,
          isPublic: url.isPublic,
        }),
      })
    );

    const deletedUrl = await urlsRepository.findById(url.id.toString());
    expect(deletedUrl).toBeNull();
  });

  it('should not be able to delete url shortener without author', async () => {
    const user = makeUser();
    const url = makeUrl({ authorId: user.id });

    await urlsRepository.create(url);

    const result = await sut.execute({
      authorId: 'non-author',
      urlId: url.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete url shortener that does not exist', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const result = await sut.execute({
      authorId: user.id.toString(),
      urlId: 'non-existent-url',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be able to delete multiple urls from same author', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url1 = makeUrl({ authorId: user.id });
    const url2 = makeUrl({ authorId: user.id });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);

    const result1 = await sut.execute({
      authorId: user.id.toString(),
      urlId: url1.id.toString(),
    });

    expect(result1.isRight()).toBe(true);

    const result2 = await sut.execute({
      authorId: user.id.toString(),
      urlId: url2.id.toString(),
    });

    expect(result2.isRight()).toBe(true);

    const deletedUrl1 = await urlsRepository.findById(url1.id.toString());
    const deletedUrl2 = await urlsRepository.findById(url2.id.toString());

    expect(deletedUrl1).toBeNull();
    expect(deletedUrl2).toBeNull();
  });
});
