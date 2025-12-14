import { Entity } from './entity';

export abstract class AggregateRoot<
  AggregateRootProps,
> extends Entity<AggregateRootProps> {}
