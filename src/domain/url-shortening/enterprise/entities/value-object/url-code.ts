import base62 from 'base62';
import { ValueObject } from '@/core/entities/value-object/value-object';

interface UrlCodeProps {
	value: string;
}

export class UrlCode extends ValueObject<UrlCodeProps> {
	constructor(numb: number) {
		const code = UrlCode.createCode(numb);

		super({
			value: code,
		});
	}

	private static createCode(num: number) {
		// ✅ Usa a lib base62 para converter número → base62
		return base62.encode(num);
	}

	public static decode(code: string): number {
		// ✅ Método extra opcional para reverter base62 → número
		return base62.decode(code);
	}
}
