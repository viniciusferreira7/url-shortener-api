import { beforeEach, describe, expect, it } from 'bun:test';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeAuthor } from '@/test/factories/make-author';
import { makeUrl } from '@/test/factories/make-url';
import { InMemoryAuthorsRepository } from '@/test/repositories/in-memory-authors-repository';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { DeleteUrlUseCase } from './delete-url';

let authorsRepository: InMemoryAuthorsRepository;
let urlsRepository: InMemoryUrlsRepository;

let sut: DeleteUrlUseCase;

describe('Delete url use case', () => {
  beforeEach(() => {
    authorsRepository = new InMemoryAuthorsRepository();
    urlsRepository = new InMemoryUrlsRepository(authorsRepository);
    sut = new DeleteUrlUseCase(authorsRepository, urlsRepository);
  });

  it('should be able to delete url shortener', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url = makeUrl({ authorId: author.id });

    await urlsRepository.create(url);

    const result = await sut.execute({
      authorId: author.id.toString(),
      urlId: url.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        url: expect.objectContaining({
          authorId: author.id,
          name: url.name,
          value: url.value,
          description: url.description,
          isPublic: url.isPublic,
        }),
      })
    );

    const deletedUrl = await urlsRepository.findById(url.id.toString());
    expect(deletedUrl).toBeNull();
  });

  it('should not be able to delete url shortener without author', async () => {
    const author = makeAuthor();
    const url = makeUrl({ authorId: author.id });

    await urlsRepository.create(url);

    const result = await sut.execute({
      authorId: 'non-author',
      urlId: url.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete url shortener that does not exist', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const result = await sut.execute({
      authorId: author.id.toString(),
      urlId: 'non-existent-url',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be able to delete multiple urls from same author', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url1 = makeUrl({ authorId: author.id });
    const url2 = makeUrl({ authorId: author.id });

    await urlsRepository.create(url1);
    await urlsRepository.create(url2);

    const result1 = await sut.execute({
      authorId: author.id.toString(),
      urlId: url1.id.toString(),
    });

    expect(result1.isRight()).toBe(true);

    const result2 = await sut.execute({
      authorId: author.id.toString(),
      urlId: url2.id.toString(),
    });

    expect(result2.isRight()).toBe(true);

    const deletedUrl1 = await urlsRepository.findById(url1.id.toString());
    const deletedUrl2 = await urlsRepository.findById(url2.id.toString());

    expect(deletedUrl1).toBeNull();
    expect(deletedUrl2).toBeNull();
  });
});
