import { describe, expect, it } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { app } from '@/infra';
import { createAuthenticatedUser } from '@/test/e2e/auth-helpers';

describe('Create URL controller E2E', () => {
  const client = treaty(app);

  it('should create a URL when authenticated', async () => {
    const { sessionHeaders, user } = await createAuthenticatedUser();

    const urlData = {
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      is_public: true,
      destination_url: faker.internet.url(),
    };

    const { data, error, status } = await client.api.urls.post(urlData, {
      headers: sessionHeaders,
    });

    expect(status).toBe(201);
    expect(error).toBeNull();
    expect(data).toBeDefined();

    if (data && 'id' in data && user) {
      expect(data.id).toBeDefined();
      expect(data.name).toBe(urlData.name);
      expect(data.destination_url).toBe(urlData.destination_url);
      expect(data.is_public).toBe(urlData.is_public);
      expect(data.description).toBe(urlData.description);
      expect(data.code).toBe(expect.any(String));
      expect(data.likes).toBe(0);
      expect(data.score).toBe(0);
      expect(data.author_id).toBe(user.id);
      expect(data.created_at).toBe(expect.any(Date));
      expect(data.created_at).toBeNull();
    }
  });

  it('should return 401 when not authenticated', async () => {
    const urlData = {
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      is_public: false,
      destination_url: faker.internet.url(),
    };

    const { error, status } = await client.api.urls.post(urlData);

    expect(status).toBe(401);
    expect(error).toBeDefined();
    expect(error?.value).toHaveProperty('message', 'Unauthorized');
  });
});
