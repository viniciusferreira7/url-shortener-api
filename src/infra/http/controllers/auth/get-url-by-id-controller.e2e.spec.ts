import { describe, expect, it } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { randomUUIDv7 } from 'bun';
import { app } from '@/infra';
import { createAuthenticatedUser } from '@/test/e2e/auth-helpers';

describe('[GET]: /api/urls/:id', () => {
  const client = treaty(app);

  it('should return URL by ID', async () => {
    const { sessionHeaders, user } = await createAuthenticatedUser();

    const urlData = {
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      is_public: true,
      destination_url: faker.internet.url(),
    };

    const { data: createdUrl } = await client.api.urls.post(urlData, {
      headers: sessionHeaders,
    });

    if (createdUrl && 'id' in createdUrl && user) {
      const { status, data, error } = await client.api
        .urls({ id: createdUrl.id })
        .get();

      expect(status).toBe(200);
      expect(error).toBeNull();
      expect(data).toBeDefined();

      if (data && 'id' in data) {
        expect(data.id).toBe(createdUrl.id);
        expect(data.name).toBe(urlData.name);
        expect(data.description).toBe(urlData.description);
        expect(data.destination_url).toBe(urlData.destination_url);
        expect(data.is_public).toBe(urlData.is_public);
        expect(data.code).toEqual(expect.any(String));
        expect(data.likes).toBe(0);
        expect(data.score).toBe(0);
        expect(data.author_id).toBe(user.id);
        expect(data.created_at).toBeDefined();
        expect(data.updated_at).toBeNull();
      }
    }
  });

  it('should return public URL by ID without authentication', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const destinationUrl = faker.internet.url();

    const { data: createdUrl } = await client.api.urls.post(
      {
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: destinationUrl,
      },
      { headers: sessionHeaders }
    );

    if (createdUrl && 'id' in createdUrl) {
      const { status, data } = await client.api
        .urls({ id: createdUrl.id })
        .get();

      expect(status).toBe(200);
      expect(data).toBeDefined();

      if (data && 'id' in data) {
        expect(data.id).toBe(createdUrl.id);
        expect(data.destination_url).toBe(destinationUrl);
        expect(data.is_public).toBe(true);
      }
    }
  });

  it('should return private URL by ID', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const { data: createdUrl } = await client.api.urls.post(
      {
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        is_public: false,
        destination_url: faker.internet.url(),
      },
      { headers: sessionHeaders }
    );

    if (createdUrl && 'id' in createdUrl) {
      const { status, data } = await client.api
        .urls({ id: createdUrl.id })
        .get();

      expect(status).toBe(200);
      expect(data).toBeDefined();

      if (data && 'id' in data) {
        expect(data.id).toBe(createdUrl.id);
        expect(data.is_public).toBe(false);
      }
    }
  });

  it('should return 404 when URL does not exist', async () => {
    const { status, error } = await client.api
      .urls({ id: randomUUIDv7() })
      .get();

    expect(status).toBe(404);
    expect(error?.value).toEqual(
      expect.objectContaining({
        message: 'Resource not found',
      })
    );
  });

  it('should return 404 for non-existent string ID', async () => {
    const { status, error } = await client.api
      .urls({ id: 'non-existent-id' })
      .get();

    expect(status).toBe(400);
    expect(error?.value).toHaveProperty('message');
  });
});
