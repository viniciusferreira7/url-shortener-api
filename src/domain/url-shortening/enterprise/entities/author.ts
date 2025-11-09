import { AggregateRoot } from '@/core/entities/aggregate-root';
import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';

interface AuthorProps {
	name: string;
	email: string;
	password: string; //TODO: Verify how better auth works with password
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Author extends AggregateRoot<AuthorProps> {
	get name() {
		return this.props.name;
	}

	get email() {
		return this.props.email;
	}

	get password() {
		return this.props.password;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	public static create(props: AuthorProps, id?: UniqueEntityId) {
		return new Author(props, id);
	}
}
