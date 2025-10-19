import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';

interface UrlProps {
	name: string;
	urlShortener: any; //TODO: create value object to this prop
	value: string;
	isPublic: boolean;
	description?: string | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Url extends Entity<UrlProps> {
	get name() {
		return this.props.name;
	}

	get urlShortener() {
		return this.props.urlShortener;
	}

	get value() {
		return this.props.value;
	}

	get isPublic() {
		return this.props.isPublic;
	}

	get description() {
		return this.props.description;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	public static create(props: UrlProps, id?: UniqueEntityId) {
		return new Url(props, id);
	}
}
