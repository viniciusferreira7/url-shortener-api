import type Hashids from 'hashids';
import type { UrlCodeGenerator } from '@/domain/url-shortening/application/url-code/url-code-generator';

export class HashUrlCodeGenerator implements UrlCodeGenerator {
  constructor(private readonly hasher: Hashids) {}

  encode(value: number): string {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Value must be a non-negative integer');
    }

    return this.hasher.encode(value);
  }

  decode(value: string): number {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Code must be a non-empty string');
    }

    const code = this.hasher.decode(value)[0];

    return Number(code);
  }
}
