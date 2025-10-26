import { randomUUIDv7 } from 'bun';

export class UniqueEntityId {
	public value: string;

	toString() {
		return this.value.toString();
	}

	toValue() {
		return this.value;
	}

	public constructor(value?: string) {
		this.value = value ?? randomUUIDv7();
	}

	public equals(id: UniqueEntityId) {
		return id.toValue() === this.toValue();
	}
}
