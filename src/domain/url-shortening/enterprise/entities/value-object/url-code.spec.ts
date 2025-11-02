import { beforeEach, describe, expect, it } from 'bun:test';
import { Base62UrlCodeGenerator } from '@/test/url-code/url-code-generator';
import { UrlCode } from './url-code';

let generator: Base62UrlCodeGenerator;

beforeEach(() => {
	generator = new Base62UrlCodeGenerator();
});

describe('UrlCode Value Object', () => {
	it('should create a UrlCode from a number', () => {
		const number = 12345;
		const urlCode = UrlCode.create(number, generator);

		expect(typeof urlCode.value).toBe('string');
		expect(urlCode.value.length).toBeGreaterThan(0);
	});

	it('should decode the UrlCode back to the original number', () => {
		const number = 98765;
		const urlCode = UrlCode.create(number, generator);

		const decoded = UrlCode.decode(urlCode.value, generator);

		expect(decoded).toBe(number);
	});

	it('should allow creating UrlCode from an existing code string', () => {
		const codeString = '3D7';
		const urlCode = UrlCode.from(codeString);

		expect(urlCode.value).toBe(codeString);
	});

	it('should throw error for invalid encode input', () => {
		expect(() => generator.encode(-1)).toThrow();
		expect(() => generator.encode(1.5)).toThrow();
	});

	it('should throw error for invalid decode input', () => {
		expect(() => generator.decode('')).toThrow();
		expect(() => generator.decode('   ')).toThrow();
	});
});
