import { type Either, right } from '@/core/either';
import type { SystemHealthRepository } from '../repositories/system-health-repository';

interface CheckServicesHealthUseCaseResponse {
  status: 'ok' | 'down';
  services: {
    redis: boolean;
    db: boolean;
  };
}

type CheckServicesHealthResult = Either<
  null,
  CheckServicesHealthUseCaseResponse
>;

export class CheckServicesHealthUseCase {
  constructor(
    private readonly systemHealthRepository: SystemHealthRepository
  ) {}

  public async execute(): Promise<CheckServicesHealthResult> {
    const result = {
      redis: false,
      db: false,
    };

    try {
      const [db, redis] = await Promise.all([
        this.systemHealthRepository.checkDatabaseConnection(),
        this.systemHealthRepository.checkCacheConnection(),
      ]);

      result.db = db;
      result.redis = redis;

      const status = result.redis && result.db ? 'ok' : 'down';

      return right({
        status,
        services: result,
      });
    } catch {
      return right({
        status: 'down',
        services: result,
      });
    }
  }
}
