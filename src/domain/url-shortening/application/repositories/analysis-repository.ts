type UrlRanking = Array<string | number>;

export interface AnalysisRepository {
  getCurrentId(): Promise<number>;
  increaseId(): Promise<number>;
  incrementBy(key: string, id: string, amount: number): Promise<void>;
  getUrlRanking(limit: number): Promise<UrlRanking>;
  delete(key: string): Promise<void>;
}
