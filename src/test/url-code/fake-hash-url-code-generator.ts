import base62 from 'base62';
import type { UrlCodeGenerator } from '@/domain/url-shortening/application/url-code/url-code-generator';

export class FakeHashUrlCodeGenerator implements UrlCodeGenerator {
  encode(value: number): string {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Value must be a non-negative integer');
    }

    return base62.encode(value);
  }

  decode(value: string): number {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Code must be a non-empty string');
    }

    return base62.decode(value);
  }
}
