import { describe, expect, it } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { randomUUIDv7 } from 'bun';
import { app } from '@/infra';
import { createAuthenticatedUser } from '@/test/e2e/auth-helpers';

describe('[PATCH]: /api/urls/:id/unlike', () => {
  const client = treaty(app);

  it('should unlike a previously liked URL', async () => {
    const { sessionHeaders: creatorHeaders } = await createAuthenticatedUser();
    const { sessionHeaders: likerHeaders } = await createAuthenticatedUser();

    const { data: urlData } = await client.api.urls.post(
      {
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      { headers: creatorHeaders }
    );

    if (urlData && 'id' in urlData) {
      const likeBody = {
        name: faker.lorem.words(3),
        is_public: true,
        destination_url: faker.internet.url(),
      };

      await client.api
        .urls({ id: urlData.id })
        .like.patch(likeBody, { headers: likerHeaders });

      const { status, error } = await client.api
        .urls({ id: urlData.id })
        .unlike.patch(likeBody, { headers: likerHeaders });

      expect(status).toBe(204);
      expect(error).toBeNull();
    }
  });

  it('should succeed when URL was never liked', async () => {
    const { sessionHeaders: creatorHeaders } = await createAuthenticatedUser();
    const { sessionHeaders: likerHeaders } = await createAuthenticatedUser();

    const { data: urlData } = await client.api.urls.post(
      {
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      { headers: creatorHeaders }
    );

    if (urlData && 'id' in urlData) {
      const { status, error } = await client.api
        .urls({ id: urlData.id })
        .unlike.patch(
          {
            name: faker.lorem.words(3),
            is_public: true,
            destination_url: faker.internet.url(),
          },
          { headers: likerHeaders }
        );

      expect(status).toBe(204);
      expect(error).toBeNull();
    }
  });

  it('should return 404 when URL does not exist', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const { status, error } = await client.api
      .urls({ id: randomUUIDv7() })
      .unlike.patch(
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
      const { status, error } = await client.api
        .urls({ id: urlData.id })
        .unlike.patch({
          name: faker.lorem.words(3),
          is_public: true,
          destination_url: faker.internet.url(),
        });

      expect(status).toBe(401);
      expect(error?.value).toHaveProperty('message', 'Unauthorized');
    }
  });
});
