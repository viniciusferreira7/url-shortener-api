export abstract class SecondaryStorageRepository {
  abstract get: (key: string) => Promise<unknown>;
  abstract set: (key: string, value: string, ttl?: number) => Promise<void>;
  abstract delete: (key: string) => Promise<void>;
}
