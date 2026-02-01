import { describe, expect, it } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { randomUUIDv7 } from 'bun';
import { app } from '@/infra';
import { createAuthenticatedUser } from '@/test/e2e/auth-helpers';

describe('[DELETE]: /api/url/:id', () => {
  const client = treaty(app);

  it('should delete a URL', async () => {
    const { sessionHeaders, user } = await createAuthenticatedUser();

    const { data: urlData } = await client.api.urls.post(
      {
        name: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      {
        headers: sessionHeaders,
      }
    );

    if (urlData && 'id' in urlData && user) {
      const { status, data, error } = await client.api
        .urls({ id: urlData?.id })
        .delete(undefined, {
          headers: sessionHeaders,
        });

      expect(status).toBe(204);
      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data).toEqual(
        expect.objectContaining({
          message: 'URL deleted successfully',
        })
      );
    }
  });

  it('should not delete URL with wrong URL ID', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const { status, error } = await client.api
      .urls({ id: randomUUIDv7() })
      .delete(undefined, {
        headers: sessionHeaders,
      });

    expect(status).toBe(404);
    expect(error?.value).toEqual(
      expect.objectContaining({
        message: 'Resource not found',
      })
    );
  });
});
