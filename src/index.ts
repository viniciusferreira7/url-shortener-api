import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { env } from '@/env';
import openapi from '@elysiajs/openapi';

const app = new Elysia()
	.use(openapi())
	.use(cors())
	.get('/', () => 'Hello Elysia')
	.listen(env.PORT);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
