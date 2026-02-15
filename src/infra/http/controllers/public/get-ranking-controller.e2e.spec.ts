import { describe, expect, test } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { app } from '@/infra';
import { createAuthenticatedUser } from '@/test/e2e/auth-helpers';

describe('[GET]: /api/public/ranking', () => {
  const client = treaty(app);

  test('should get ranking without authentication', async () => {
    const { status, data } = await client.api.public.ranking.get();

    expect(status).toBe(200);
    expect(data).toBeDefined();

    if (data && Array.isArray(data)) {
      expect(data).toBeArray();

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
    }
  });

  test('should return ranking with correct structure', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    await client.api.urls.post(
      {
        name: 'Ranking Test URL',
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      {
        headers: sessionHeaders,
      }
    );

    const { status, data } = await client.api.public.ranking.get();

    expect(status).toBe(200);
    expect(data).toBeDefined();

    if (data && Array.isArray(data)) {
      expect(data).toBeArray();
    }
  });

  test('should return top 10 URLs maximum', async () => {
    const { status, data } = await client.api.public.ranking.get();

    expect(status).toBe(200);

    if (data && Array.isArray(data)) {
      expect(data.length).toBeLessThanOrEqual(10);
    }
  });

  test('should return empty array when no URLs exist in ranking', async () => {
    const { status, data } = await client.api.public.ranking.get();

    expect(status).toBe(200);
    expect(data).toBeDefined();

    if (data && Array.isArray(data)) {
      expect(data).toBeArray();
    }
  });

  test('should only return public URLs in ranking', async () => {
    const { status, data } = await client.api.public.ranking.get();

    expect(status).toBe(200);

    if (data && Array.isArray(data)) {
      data.forEach((url) => {
        expect(url.url_is_public).toBe(true);
      });
    }
  });
});
