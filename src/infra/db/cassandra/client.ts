import { Client } from 'cassandra-driver';
import { env } from '@/infra/env';

export const cassandraClient = new Client({
  contactPoints: env.CASSANDRA_CONTACT_POINTS.split(',').map((point) =>
    point.trim()
  ),
  localDataCenter: env.CASSANDRA_DC,
  keyspace: env.CASSANDRA_KEYSPACE,
  credentials: {
    username: env.CASSANDRA_USERNAME,
    password: env.CASSANDRA_PASSWORD,
  },
  pooling: {
    coreConnectionsPerHost: {
      0: 2,
      1: 1,
    },
  },
  socketOptions: {
    connectTimeout: 10000,
    readTimeout: 12000,
  },
  queryOptions: {
    consistency: 1, // ONE
  },
});
