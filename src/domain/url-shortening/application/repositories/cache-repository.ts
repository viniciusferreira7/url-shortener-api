export interface CacheRepository {
	getCurrentId(): Promise<number>;
	increaseId(): Promise<number>;
}
