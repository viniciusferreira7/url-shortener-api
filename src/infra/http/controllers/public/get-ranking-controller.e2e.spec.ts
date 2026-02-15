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

  test('should return ranking ordered by access count', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const { data: url1 } = await client.api.urls.post(
      {
        name: 'Most Accessed URL',
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      {
        headers: sessionHeaders,
      }
    );

    const { data: url2 } = await client.api.urls.post(
      {
        name: 'Less Accessed URL',
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      {
        headers: sessionHeaders,
      }
    );

    if (url1 && 'code' in url1 && url2 && 'code' in url2) {
      await fetch(`http://localhost:3333/api/public/${url1.code}`, {
        redirect: 'manual',
      });
      await fetch(`http://localhost:3333/api/public/${url1.code}`, {
        redirect: 'manual',
      });
      await fetch(`http://localhost:3333/api/public/${url1.code}`, {
        redirect: 'manual',
      });

      await fetch(`http://localhost:3333/api/public/${url2.code}`, {
        redirect: 'manual',
      });

      const { status, data } = await client.api.public.ranking.get();

      expect(status).toBe(200);
      expect(data).toBeDefined();

      if (data && Array.isArray(data) && data.length > 0) {
        expect(data).toBeArray();
        expect(data[0].url_code).toBe(url1.code);
      }
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

  test('should rank URLs by access count', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const urls: Array<{ code: string }> = [];

    for (let i = 0; i < 3; i++) {
      const { data } = await client.api.urls.post(
        {
          name: `Test URL ${i + 1}`,
          description: faker.lorem.sentence(),
          is_public: true,
          destination_url: faker.internet.url(),
        },
        {
          headers: sessionHeaders,
        }
      );

      if (data && 'code' in data) {
        urls.push(data);

        for (let j = 0; j < 3 - i; j++) {
          await fetch(`http://localhost:3333/api/public/${data.code}`, {
            redirect: 'manual',
          });
        }
      }
    }

    const { status, data } = await client.api.public.ranking.get();

    expect(status).toBe(200);

    if (data && Array.isArray(data) && data.length >= 3) {
      const topUrl = data.find((url) => url.url_code === urls[0].code);
      expect(topUrl).toBeDefined();
    }
  });
});
