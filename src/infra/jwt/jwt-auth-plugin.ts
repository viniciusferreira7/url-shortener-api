import Elysia from 'elysia';
import { jwtConfig } from '@/infra/jwt/jwt-config';

export const jwtAuthPlugin = new Elysia({ name: 'jwt-auth-plugin' })
  .use(jwtConfig)
  .macro({
    auth: {
      async resolve({ status, request: { headers }, jwt }) {
        const authorization = headers.get('authorization');

        if (!authorization?.startsWith('Bearer ')) {
          return status(401, { message: 'Missing or invalid token' });
        }

        const token = authorization.slice(7);

        try {
          const payload = await jwt.verify(token);

          if (!payload) {
            return status(401, { message: 'Invalid token' });
          }

          return {
            auth: payload,
          };
        } catch {
          return status(401, { message: 'Invalid token' });
        }
      },
    },
  });
