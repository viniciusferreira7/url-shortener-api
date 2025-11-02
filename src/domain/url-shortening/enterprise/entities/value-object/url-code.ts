// domain/entities/url-code.ts
import { ValueObject } from '@/core/entities/value-object/value-object';
import type { UrlCodeGenerator } from '@/domain/url-shortening/application/url-code/url-code-generator';

interface UrlCodeProps {
	value: string;
}

export class UrlCode extends ValueObject<UrlCodeProps> {
	get value(): string {
		return this.props.value;
	}

	static create(numb: number, generator: UrlCodeGenerator): UrlCode {
		const code = generator.encode(numb);
		return new UrlCode({ value: code });
	}

	static from(code: string): UrlCode {
		return new UrlCode({ value: code });
	}

	static decode(code: string, generator: UrlCodeGenerator): number {
		return generator.decode(code);
	}
}
