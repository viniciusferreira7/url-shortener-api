import Hashids from 'hashids';
import { env } from '../env';

const BASE64_URL_SAFE_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export const hashids = new Hashids(
  env.SECRET_HASH_KEY,
  10,
  BASE64_URL_SAFE_ALPHABET
);
