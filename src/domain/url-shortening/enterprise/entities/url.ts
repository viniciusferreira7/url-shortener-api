import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';

interface UrlProps {
	name: string;
	value: string;
	code: string;
	isPublic: boolean;
	description?: string | null;
	authorId: string;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Url extends Entity<UrlProps> {
	get name() {
		return this.props.name;
	}

	get value() {
		return this.props.value;
	}

	get code() {
		return this.props.code;
	}

	get isPublic() {
		return this.props.isPublic;
	}

	get description() {
		return this.props.description;
	}

	get authorId() {
		return this.props.authorId;
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
