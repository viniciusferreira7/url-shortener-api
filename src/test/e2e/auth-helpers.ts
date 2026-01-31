import { faker } from '@faker-js/faker';
import { auth } from '@/infra/lib/auth';

export interface TestUser {
  email: string;
  password: string;
  name: string;
}

export function generateTestUser(): TestUser {
  return {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    name: faker.person.fullName(),
  };
}

/**
 * Creates a new user using Better Auth server API
 */
export async function signUpUser(userData?: Partial<TestUser>) {
  const user = { ...generateTestUser(), ...userData };

  const response = await auth.api.signUpEmail({
    body: {
      email: user.email,
      password: user.password,
      name: user.name,
    },
  });

  return { user, response };
}

/**
 * Signs in a user using Better Auth server API
 */
export async function signInUser(credentials: {
  email: string;
  password: string;
}) {
  const response = await auth.api.signInEmail({
    body: {
      email: credentials.email,
      password: credentials.password,
    },
  });

  return response;
}

/**
 * Creates an authenticated user and returns the user data along with session cookies
 */
export async function createAuthenticatedUser() {
  const user = generateTestUser();

  const { headers } = await auth.api.signUpEmail({
    body: {
      email: user.email,
      password: user.password,
      name: user.name,
    },
    returnHeaders: true,
  });

  const setCookie = headers.get('set-cookie');

  if (!setCookie) {
    throw new Error('No session cookie received after signup');
  }

  return {
    user,
    sessionHeaders: {
      cookie: setCookie,
    },
  };
}
