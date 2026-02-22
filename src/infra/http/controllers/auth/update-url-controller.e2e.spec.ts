import { describe, expect, it } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { randomUUIDv7 } from 'bun';
import { app } from '@/infra';
import { createAuthenticatedUser } from '@/test/e2e/auth-helpers';

describe('[PUT]: /api/urls/:id', () => {
  const client = treaty(app);

  it('should update a URL when authenticated as owner', async () => {
    const { sessionHeaders, user } = await createAuthenticatedUser();

    const { data: urlData } = await client.api.urls.post(
      {
        name: 'Original Name',
        description: 'Original description',
        is_public: false,
        destination_url: faker.internet.url(),
      },
      { headers: sessionHeaders }
    );

    if (urlData && 'id' in urlData && user) {
      const updatedFields = {
        name: 'Updated Name',
        description: 'Updated description',
        is_public: true,
        destination_url: faker.internet.url(),
      };

      const { status, data, error } = await client.api
        .urls({ id: urlData.id })
        .put(updatedFields, { headers: sessionHeaders });

      expect(status).toBe(200);
      expect(error).toBeNull();
      expect(data).toBeDefined();

      if (data && 'id' in data) {
        expect(data.id).toBe(urlData.id);
        expect(data.name).toBe(updatedFields.name);
        expect(data.description).toBe(updatedFields.description);
        expect(data.is_public).toBe(updatedFields.is_public);
        expect(data.destination_url).toBe(updatedFields.destination_url);
        expect(data.author_id).toBe(user.id);
        expect(data.updated_at).not.toBeNull();
      }
    }
  });

  it('should update URL with null description', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const { data: urlData } = await client.api.urls.post(
      {
        name: faker.lorem.words(3),
        description: 'Some description',
        is_public: true,
        destination_url: faker.internet.url(),
      },
      { headers: sessionHeaders }
    );

    if (urlData && 'id' in urlData) {
      const { status, data } = await client.api.urls({ id: urlData.id }).put(
        {
          name: urlData.name,
          description: null,
          is_public: urlData.is_public,
          destination_url: urlData.destination_url,
        },
        { headers: sessionHeaders }
      );

      expect(status).toBe(200);

      if (data && 'id' in data) {
        expect(data.description).toBeNull();
      }
    }
  });

  it('should return 404 when URL does not exist', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const { status, error } = await client.api.urls({ id: randomUUIDv7() }).put(
      {
        name: faker.lorem.words(3),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      { headers: sessionHeaders }
    );

    expect(status).toBe(404);
    expect(error?.value).toEqual(
      expect.objectContaining({
        message: 'Resource not found',
      })
    );
  });

  it('should return 405 when trying to update another user URL', async () => {
    const { sessionHeaders: ownerHeaders } = await createAuthenticatedUser();
    const { sessionHeaders: otherHeaders } = await createAuthenticatedUser();

    const { data: urlData } = await client.api.urls.post(
      {
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      { headers: ownerHeaders }
    );

    if (urlData && 'id' in urlData) {
      const { status, error } = await client.api.urls({ id: urlData.id }).put(
        {
          name: 'Hijacked Name',
          is_public: true,
          destination_url: faker.internet.url(),
        },
        { headers: otherHeaders }
      );

      expect(status).toBe(405);
      expect(error?.value).toHaveProperty('message');
    }
  });

  it('should return 401 when not authenticated', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const { data: urlData } = await client.api.urls.post(
      {
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      { headers: sessionHeaders }
    );

    if (urlData && 'id' in urlData) {
      const { status, error } = await client.api.urls({ id: urlData.id }).put({
        name: faker.lorem.words(3),
        is_public: true,
        destination_url: faker.internet.url(),
      });

      expect(status).toBe(401);
      expect(error?.value).toHaveProperty('message', 'Unauthorized');
    }
  });
});
