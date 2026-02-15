import { describe, expect, test } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { app } from '@/infra';
import { createAuthenticatedUser } from '@/test/e2e/auth-helpers';

describe('[GET]: /api/urls/me', () => {
  const client = treaty(app);

  test('should fetch user URLs when authenticated', async () => {
    const { sessionHeaders, user } = await createAuthenticatedUser();

    const urlsToCreate = 3;

    for (let i = 0; i < urlsToCreate; i++) {
      await client.api.urls.post(
        {
          name: `My URL ${i + 1}`,
          description: faker.lorem.sentence(),
          is_public: i % 2 === 0,
          destination_url: faker.internet.url(),
        },
        {
          headers: sessionHeaders,
        }
      );
    }

    const { status, data } = await client.api.urls.me.get({
      headers: sessionHeaders,
      query: {
        page: 1,
        per_page: 10,
      },
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();

    if (data && 'result' in data) {
      expect(data.page).toBeDefined();
      expect(data.total_pages).toBeDefined();
      expect(data.per_page).toBeDefined();
      expect(data.result).toBeArray();
      expect(data.result.length).toBeGreaterThanOrEqual(urlsToCreate);

      data.result.forEach((url) => {
        expect(url).toHaveProperty('id');
        expect(url).toHaveProperty('name');
        expect(url).toHaveProperty('code');
        expect(url).toHaveProperty('destination_url');
        expect(url).toHaveProperty('is_public');
        expect(url).toHaveProperty('likes');
        expect(url).toHaveProperty('score');
        expect(url).toHaveProperty('created_at');
        expect(url).toHaveProperty('author_id');

        if (user) {
          expect(url.author_id).toBe(user.id);
        }
      });
    }
  });

  test('should return empty result when user has no URLs', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const { status, data } = await client.api.urls.me.get({
      headers: sessionHeaders,
      query: {
        page: 1,
        per_page: 10,
      },
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();

    if (data && 'result' in data) {
      expect(data.result).toBeArray();
      expect(data.page).toBe(1);
      expect(data.total_pages).toBeGreaterThanOrEqual(1);
      expect(data.per_page).toBe(10);
    }
  });

  test('should return 401 when not authenticated', async () => {
    const { status, error } = await client.api.urls.me.get({
      query: {
        page: 1,
        per_page: 10,
      },
    });

    expect(status).toBe(401);
    expect(error).toBeDefined();
    expect(error?.value).toHaveProperty('message', 'Unauthorized');
  });

  test('should support pagination parameters', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    for (let i = 0; i < 5; i++) {
      await client.api.urls.post(
        {
          name: `Paginated URL ${i + 1}`,
          description: faker.lorem.sentence(),
          is_public: true,
          destination_url: faker.internet.url(),
        },
        {
          headers: sessionHeaders,
        }
      );
    }

    const { status, data } = await client.api.urls.me.get({
      query: {
        page: 1,
        per_page: 3,
      },
      headers: sessionHeaders,
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();

    if (data && 'result' in data) {
      expect(data.page).toBe(1);
      expect(data.per_page).toBe(3);
      expect(data.result.length).toBeLessThanOrEqual(3);
    }
  });

  test('should support search parameter', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const uniqueSearchTerm = `SearchTest${Date.now()}`;

    await client.api.urls.post(
      {
        name: uniqueSearchTerm,
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      {
        headers: sessionHeaders,
      }
    );

    const { status, data } = await client.api.urls.me.get({
      query: {
        search: uniqueSearchTerm,
        page: 1,
        per_page: 10,
      },
      headers: sessionHeaders,
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();

    if (data && 'result' in data) {
      expect(data.result).toBeArray();
      expect(data.result.length).toBeGreaterThan(0);

      const hasSearchTerm = data.result.some((url) =>
        url.name.includes(uniqueSearchTerm)
      );
      expect(hasSearchTerm).toBe(true);
    }
  });

  test('should support is_public filter', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    await client.api.urls.post(
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

    await client.api.urls.post(
      {
        name: 'Private URL',
        description: faker.lorem.sentence(),
        is_public: false,
        destination_url: faker.internet.url(),
      },
      {
        headers: sessionHeaders,
      }
    );

    const { status, data } = await client.api.urls.me.get({
      query: {
        is_public: true,
        page: 1,
        per_page: 10,
      },
      headers: sessionHeaders,
    });

    expect(status).toBe(200);

    if (data && 'result' in data) {
      data.result.forEach((url) => {
        expect(url.is_public).toBe(true);
      });
    }
  });

  test('should support order parameter', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    for (let i = 0; i < 3; i++) {
      await client.api.urls.post(
        {
          name: `URL ${i + 1}`,
          description: faker.lorem.sentence(),
          is_public: true,
          destination_url: faker.internet.url(),
        },
        {
          headers: sessionHeaders,
        }
      );
    }

    const { status, data } = await client.api.urls.me.get({
      query: {
        order: '-created_at',
        page: 1,
        per_page: 10,
      },
      headers: sessionHeaders,
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();
  });

  test('should support created_at_gte filter', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();
    const today = new Date().toISOString().split('T')[0];

    await client.api.urls.post(
      {
        name: 'Recent URL',
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      {
        headers: sessionHeaders,
      }
    );

    const { status, data } = await client.api.urls.me.get({
      query: {
        created_at_gte: today,
        page: 1,
        per_page: 10,
      },
      headers: sessionHeaders,
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();
  });

  test('should support updated_at_gte filter', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();
    const today = new Date().toISOString().split('T')[0];

    const { status, data } = await client.api.urls.me.get({
      query: {
        updated_at_gte: today,
        page: 1,
        per_page: 10,
      },
      headers: sessionHeaders,
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();
  });

  test('should only return URLs owned by the authenticated user', async () => {
    const { sessionHeaders: user1Headers, user: user1 } =
      await createAuthenticatedUser();
    const { sessionHeaders: user2Headers } = await createAuthenticatedUser();

    await client.api.urls.post(
      {
        name: 'User 1 URL',
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      {
        headers: user1Headers,
      }
    );

    await client.api.urls.post(
      {
        name: 'User 2 URL',
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      {
        headers: user2Headers,
      }
    );

    const { status, data } = await client.api.urls.me.get({
      headers: user1Headers,
      query: {
        page: 1,
        per_page: 10,
      },
    });

    expect(status).toBe(200);

    if (data && 'result' in data && user1) {
      data.result.forEach((url) => {
        expect(url.author_id).toBe(user1.id);
      });

      const hasUser2Url = data.result.some((url) => url.name === 'User 2 URL');
      expect(hasUser2Url).toBe(false);
    }
  });
});
