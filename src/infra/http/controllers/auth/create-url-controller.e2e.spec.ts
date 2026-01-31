import { beforeAll, describe, expect, it } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { app } from '@/infra';
import { createAuthenticatedUser } from '@/test/e2e/auth-helpers';

describe('Create URL controller E2E', () => {
  const client = treaty(app);
  let authHeaders: {
    cookie: string;
  };

  beforeAll(async () => {
    const { sessionHeaders } = await createAuthenticatedUser();
    authHeaders = sessionHeaders;
  });

  it('should create a URL when authenticated', async () => {
    const urlData = {
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      is_public: true,
      destination_url: faker.internet.url(),
    };

    const { data, error, status } = await client.api.urls.post(urlData, {
      headers: authHeaders,
    });

    if (status !== 201) {
      console.log('Unexpected status:', status);
      console.log('Error:', JSON.stringify(error, null, 2));
      console.log('Data:', JSON.stringify(data, null, 2));
    }

    expect(status).toBe(201);
    expect(error).toBeNull();
    expect(data).toBeDefined();

    if (data && 'name' in data) {
      expect(data.name).toBe(urlData.name);
      expect(data.destination_url).toBe(urlData.destination_url);
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
