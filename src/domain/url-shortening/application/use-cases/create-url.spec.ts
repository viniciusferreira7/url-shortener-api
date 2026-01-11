import { beforeEach, describe, expect, it } from 'bun:test';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUrl } from '@/test/factories/make-url';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryAnalysisRepository } from '@/test/repositories/in-memory-analysis-repository';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { Base62UrlCodeGenerator } from '@/test/url-code/url-code-generator';
import { CreateUrlUseCase } from './create-url';

let usersRepository: InMemoryUsersRepository;
let urlsRepository: InMemoryUrlsRepository;
let analysisRepository: InMemoryAnalysisRepository;
let urlCodeGenerator: Base62UrlCodeGenerator;

let sut: CreateUrlUseCase;

describe('Create url use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    urlsRepository = new InMemoryUrlsRepository(usersRepository);
    analysisRepository = new InMemoryAnalysisRepository();
    urlCodeGenerator = new Base62UrlCodeGenerator();
    sut = new CreateUrlUseCase(
      usersRepository,
      urlsRepository,
      analysisRepository,
      urlCodeGenerator
    );
  });

  it('should be able to create url shortener', async () => {
    const user = makeUser();

    await usersRepository.create(user);

    const url = makeUrl();

    const result = await sut.execute({
      authorId: user.id.toString(),
      name: url.name,
      destinationUrl: url.destinationUrl,
      description: url.description,
      isPublic: false,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        url: expect.objectContaining({
          authorId: user.id,
          name: url.name,
          destinationUrl: url.destinationUrl,
          description: url.description,
          isPublic: false,
          code: expect.any(String),
        }),
      })
    );

    const codeId = await analysisRepository.getCurrentId();

    expect(codeId).toEqual(1);
  });

  it('should not be able to create url shortener without author', async () => {
    const url = makeUrl();

    const result = await sut.execute({
      authorId: 'non-author',
      name: url.name,
      destinationUrl: url.destinationUrl,
      description: url.description,
      isPublic: false,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
