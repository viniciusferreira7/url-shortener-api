import { describe, expect, test } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { app } from '@/infra';
import { createAuthenticatedUser } from '@/test/e2e/auth-helpers';

describe('[GET]: /api/public/urls/:code', () => {
  const client = treaty(app);

  test('should redirect to destination URL with status 302', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const destinationUrl = faker.internet.url();

    const { data: urlData } = await client.api.urls.post(
      {
        name: 'Redirect Test URL',
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: destinationUrl,
      },
      {
        headers: sessionHeaders,
      }
    );

    if (urlData && 'code' in urlData) {
      const response = await fetch(
        `http://localhost:3333/api/public/urls/${urlData.code}`,
        {
          redirect: 'manual',
        }
      );

      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toBe(destinationUrl);
    }
  });

  test('should return 404 when URL code does not exist', async () => {
    const nonExistentCode = 'nonexistent123';

    const response = await fetch(
      `http://localhost:3333/api/public/urls/${nonExistentCode}`,
      {
        redirect: 'manual',
      }
    );

    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data).toHaveProperty('message');
  });

  test('should increment access count when redirecting', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const { data: urlData } = await client.api.urls.post(
      {
        name: 'Access Count Test',
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: faker.internet.url(),
      },
      {
        headers: sessionHeaders,
      }
    );

    if (urlData && 'code' in urlData) {
      await fetch(`http://localhost:3333/api/public/urls/${urlData.code}`, {
        redirect: 'manual',
      });

      await fetch(`http://localhost:3333/api/public/urls/${urlData.code}`, {
        redirect: 'manual',
      });

      const response = await fetch(
        `http://localhost:3333/api/public/urls/${urlData.code}`,
        {
          redirect: 'manual',
        }
      );

      expect(response.status).toBe(302);
    }
  });

  test('should work with public URLs', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const destinationUrl = faker.internet.url();

    const { data: urlData } = await client.api.urls.post(
      {
        name: 'Public URL Test',
        description: faker.lorem.sentence(),
        is_public: true,
        destination_url: destinationUrl,
      },
      {
        headers: sessionHeaders,
      }
    );

    if (urlData && 'code' in urlData) {
      const response = await fetch(
        `http://localhost:3333/api/public/urls/${urlData.code}`,
        {
          redirect: 'manual',
        }
      );

      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toBe(destinationUrl);
    }
  });

  test('should redirect to destination URL regardless of URL privacy', async () => {
    const { sessionHeaders } = await createAuthenticatedUser();

    const destinationUrl = faker.internet.url();

    const { data: urlData } = await client.api.urls.post(
      {
        name: 'Private URL Test',
        description: faker.lorem.sentence(),
        is_public: false,
        destination_url: destinationUrl,
      },
      {
        headers: sessionHeaders,
      }
    );

    if (urlData && 'code' in urlData) {
      const response = await fetch(
        `http://localhost:3333/api/public/urls/${urlData.code}`,
        {
          redirect: 'manual',
        }
      );

      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toBe(destinationUrl);
    }
  });
});
