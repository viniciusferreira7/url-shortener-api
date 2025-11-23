import { Entity } from '@/core/entities/entity';
import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';

interface UrlProps {
	name: string;
	value: string;
	code: string;
	isPublic: boolean;
	description?: string | null;
	authorId: UniqueEntityId;
	createdAt: Date;
	updatedAt?: Date | null;
	likes: number;
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

	get likes() {
		return this.props.likes;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	set name(value: string) {
		this.props.name = value;
	}

	set value(val: string) {
		this.props.value = val;
	}

	set description(value: string | null | undefined) {
		this.props.description = value;
	}

	set isPublic(value: boolean) {
		this.props.isPublic = value;
	}

	set updatedAt(value: Date | null | undefined) {
		this.props.updatedAt = value;
	}

	set likes(value: number) {
		this.props.likes = value;
	}

	public static create(props: UrlProps, id?: UniqueEntityId) {
		return new Url(props, id);
	}
}
