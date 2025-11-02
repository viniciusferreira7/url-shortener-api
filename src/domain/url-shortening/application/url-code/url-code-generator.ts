export interface UrlCodeGenerator {
	encode(value: number): string;
	decode(value: string): number;
}
