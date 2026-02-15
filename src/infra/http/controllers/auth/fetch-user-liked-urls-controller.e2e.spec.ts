import { describe, expect, test } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { app } from '@/infra';
import { makeLikeUrlUseCase } from '@/infra/factories/make-like-url-use-case';
import { createAuthenticatedUser } from '@/test/e2e/auth-helpers';

describe('[GET]: /api/urls/liked', () => {
  const client = treaty(app);

  test('should fetch user liked URLs when authenticated', async () => {
    const { sessionHeaders, user } = await createAuthenticatedUser();

    const urlIds: string[] = [];

    for (let i = 0; i < 3; i++) {
      const { data: urlData } = await client.api.urls.post(
        {
          name: `Liked URL ${i + 1}`,
          description: faker.lorem.sentence(),
          is_public: true,
          destination_url: faker.internet.url(),
        },
        {
          headers: sessionHeaders,
        }
      );

      if (urlData && 'id' in urlData && user) {
        urlIds.push(urlData.id);

        const likeUseCase = makeLikeUrlUseCase();
        await likeUseCase.execute({
          urlId: urlData.id,
          authorId: user.id,
        });
      }
    }

    const { status, data } = await client.api.urls.liked.get({
      headers: sessionHeaders,
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();

    if (data && Array.isArray(data)) {
      expect(data.length).toBe(3);

      data.forEach((url) => {
        expect(url).toHaveProperty('url_id');
        expect(url).toHaveProperty('url_name');
        expect(url).toHaveProperty('url_code');
        expect(url).toHaveProperty('destination_url');
        expect(url).toHaveProperty('url_is_public');
        expect(url).toHaveProperty('url_likes');
        expect(url).toHaveProperty('score');
        expect(url).toHaveProperty('created_at');
        expect(url).toHaveProperty('author_id');
      });

      const likedUrlIds = data.map((url) => url.url_id);
      urlIds.forEach((urlId) => {
        expect(likedUrlIds).toContain(urlId);
      });
    }
  });

  test('should return empty array when user has no liked URLs', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const { status, data } = await client.api.urls.liked.get({
      headers: sessionHeaders,
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();

    if (data && Array.isArray(data)) {
      expect(data.length).toBe(0);
    }
  });

  test('should return 401 when not authenticated', async () => {
    const { status, error } = await client.api.urls.liked.get();

    expect(status).toBe(401);
    expect(error).toBeDefined();
    expect(error?.value).toHaveProperty('message', 'Unauthorized');
  });

  test('should return URLs that user liked', async () => {
    const { sessionHeaders, user } = await createAuthenticatedUser();

    const { data: publicUrl } = await client.api.urls.post(
      {
        name: 'Public URL',
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      {
        headers: sessionHeaders,
      }
    );

    if (publicUrl && 'id' in publicUrl && user) {
      const likeUseCase = makeLikeUrlUseCase();
      await likeUseCase.execute({
        urlId: publicUrl.id,
        authorId: user.id,
      });
    }

    const { status, data } = await client.api.urls.liked.get({
      headers: sessionHeaders,
    });

    expect(status).toBe(200);

    if (data && Array.isArray(data)) {
      expect(data.length).toBe(1);
      expect(data[0].url_name).toBe('Public URL');
      expect(data[0].url_is_public).toBe(true);
    }
  });

  test('should return liked URLs with correct structure', async () => {
    const { sessionHeaders, user } = await createAuthenticatedUser();

    const { data: urlData } = await client.api.urls.post(
      {
        name: 'Test Liked URL',
        description: 'Test description',
        is_public: true,
        destination_url: faker.internet.url(),
      },
      {
        headers: sessionHeaders,
      }
    );

    if (urlData && 'id' in urlData && user) {
      const likeUseCase = makeLikeUrlUseCase();
      await likeUseCase.execute({
        urlId: urlData.id,
        authorId: user.id,
      });

      const { status, data } = await client.api.urls.liked.get({
        headers: sessionHeaders,
      });

      expect(status).toBe(200);

      if (data && Array.isArray(data) && data.length > 0) {
        const url = data.find((u) => u.url_id === urlData.id);
        expect(url).toBeDefined();

        if (url) {
          expect(url.url_name).toBe('Test Liked URL');
          expect(url.url_description).toBe('Test description');
          expect(url.url_is_public).toBe(true);
          expect(url.url_likes).toBeGreaterThanOrEqual(1);
          expect(url.author_id).toBe(user.id);
        }
      }
    }
  });
});
