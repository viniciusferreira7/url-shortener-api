import { beforeEach, describe, expect, it } from 'bun:test';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeAuthor } from '@/test/factories/make-author';
import { makeUrl } from '@/test/factories/make-url';
import { InMemoryAuthorsRepository } from '@/test/repositories/in-memory-authors-repository';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { UpdateUrlUseCase } from './update-url';

let authorsRepository: InMemoryAuthorsRepository;
let urlsRepository: InMemoryUrlsRepository;

let sut: UpdateUrlUseCase;

describe('Update url use case', () => {
  beforeEach(() => {
    authorsRepository = new InMemoryAuthorsRepository();
    urlsRepository = new InMemoryUrlsRepository(authorsRepository);
    sut = new UpdateUrlUseCase(authorsRepository, urlsRepository);
  });

  it('should be able to update url shortener name', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url = makeUrl({ authorId: author.id });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: author.id.toString(),
      name: 'Updated URL Name',
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.name).toBe('Updated URL Name');
      expect(result.value.url.value).toBe(url.value);
      expect(result.value.url.updatedAt).toBeTruthy();
    }
  });

  it('should be able to update url shortener value', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url = makeUrl({ authorId: author.id });

    await urlsRepository.create(url);

    const newValue = 'https://example.com/new-path';

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: author.id.toString(),
      value: newValue,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.value).toBe(newValue);
      expect(result.value.url.name).toBe(url.name);
    }
  });

  it('should be able to update url shortener description', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url = makeUrl({ authorId: author.id });

    await urlsRepository.create(url);

    const newDescription = 'Updated description';

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: author.id.toString(),
      description: newDescription,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.description).toBe(newDescription);
    }
  });

  it('should be able to update url shortener isPublic', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url = makeUrl({ authorId: author.id, isPublic: false });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: author.id.toString(),
      isPublic: true,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.isPublic).toBe(true);
    }
  });

  it('should be able to update url shortener with multiple fields', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url = makeUrl({ authorId: author.id, isPublic: false });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: author.id.toString(),
      name: 'New Name',
      value: 'https://example.com/new',
      description: 'New description',
      isPublic: true,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.name).toBe('New Name');
      expect(result.value.url.value).toBe('https://example.com/new');
      expect(result.value.url.description).toBe('New description');
      expect(result.value.url.isPublic).toBe(true);
    }
  });

  it('should be able to clear url shortener description', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url = makeUrl({
      authorId: author.id,
      description: 'Some description',
    });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: author.id.toString(),
      description: null,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.url.description).toBeNull();
    }
  });

  it('should not be able to update url shortener without author', async () => {
    const author = makeAuthor();
    const url = makeUrl({ authorId: author.id });

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
    const author = makeAuthor();

    await authorsRepository.create(author);

    const result = await sut.execute({
      urlId: 'non-existent-url',
      authorId: author.id.toString(),
      name: 'Updated Name',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to update url shortener from another author', async () => {
    const author1 = makeAuthor();
    const author2 = makeAuthor();

    await authorsRepository.create(author1);
    await authorsRepository.create(author2);

    const url = makeUrl({ authorId: author1.id });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: author2.id.toString(),
      name: 'Updated Name',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should update url shortener timestamp when modified', async () => {
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url = makeUrl({ authorId: author.id });

    await urlsRepository.create(url);

    const originalUpdatedAt = url.updatedAt;

    await new Promise((resolve) => setTimeout(resolve, 10));

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: author.id.toString(),
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
    const author = makeAuthor();

    await authorsRepository.create(author);

    const url = makeUrl({ authorId: author.id });

    await urlsRepository.create(url);

    const result = await sut.execute({
      urlId: url.id.toString(),
      authorId: author.id.toString(),
      name: 'Updated Name',
      value: 'https://updated.example.com',
    });

    expect(result.isRight()).toBe(true);

    const savedUrl = await urlsRepository.findById(url.id.toString());

    expect(savedUrl).toBeTruthy();
    expect(savedUrl?.name).toBe('Updated Name');
    expect(savedUrl?.value).toBe('https://updated.example.com');
  });
});
