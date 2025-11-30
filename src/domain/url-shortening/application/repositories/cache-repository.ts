export interface CacheRepository {
	getCurrentId(): Promise<number>;
	increaseId(): Promise<number>;
	get<T>(key: string): Promise<T | null>;
	set<T>(key: string, value: T, ttl?: number): Promise<void>;
	incrementBy(key: string, id: string, amount: number): Promise<void>;
	delete(key: string): Promise<void>;
	clear(): Promise<void>;
}
