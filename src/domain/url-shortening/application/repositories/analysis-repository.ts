type UrlRanking = Array<string | number>;

export interface AnalysisRepository {
  getCurrentId(): Promise<number>;
  increaseId(): Promise<number>;
  //TODO: remove get and set, to use same example from 05-nest, to put cache layer into infra like 05-nest
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  incrementBy(key: string, id: string, amount: number): Promise<void>;
  getUrlRanking(limit: number): Promise<UrlRanking>;
  delete(key: string): Promise<void>;
}
