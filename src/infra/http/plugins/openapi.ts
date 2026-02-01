import openapi from '@elysiajs/openapi';
import Elysia from 'elysia';
import z from 'zod';
import { auth } from '@/infra/lib/auth';

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
// biome-ignore lint/suspicious/noAssignInExpressions: This is on documentation
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: (prefix = '/auth') =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          // biome-ignore lint/suspicious/noExplicitAny: It doesn`t have type
          const operation = (reference[key] as any)[method];

          operation.tags = ['Better Auth'];
        }
      }

      return reference;
      // biome-ignore lint/suspicious/noExplicitAny: It doesn`t have type
    }) as Promise<any>,
  // biome-ignore lint/suspicious/noExplicitAny: It doesn`t have type
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;

export const openApiPlugin = new Elysia({ name: 'Openapi' }).use(
  openapi({
    mapJsonSchema: {
      zod: z.toJSONSchema,
    },
    documentation: {
      components: {
        ...(await OpenAPI.components),
        securitySchemes: {
          ...(await OpenAPI.components).securitySchemes,
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT API Key for protected endpoints',
          },
        },
      },
      paths: await OpenAPI.getPaths(),
    },
  })
);
