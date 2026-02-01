import jwt from '@elysiajs/jwt';
import Elysia from 'elysia';
import { env } from '../env';

export const jwtConfig = new Elysia({ name: 'JWT config' }).use(
  jwt({
    name: 'jwt',
    secret: env.JWT_SECRET,
  })
);
