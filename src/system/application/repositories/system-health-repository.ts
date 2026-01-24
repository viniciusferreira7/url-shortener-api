export interface SystemHealthRepository {
  checkDatabaseConnection(): Promise<boolean>;
  checkCacheConnection(): Promise<boolean>;
}
