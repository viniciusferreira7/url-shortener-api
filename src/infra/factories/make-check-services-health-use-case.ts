import { CheckServicesHealthUseCase } from '@/system/application/use-cases/check-services-health';
import { InfraSystemHealthRepository } from '../system/repositories/system-health-repository';

export function makeCheckServicesHealthUseCase(): CheckServicesHealthUseCase {
  const systemHealthRepository = new InfraSystemHealthRepository();

  return new CheckServicesHealthUseCase(systemHealthRepository);
}
