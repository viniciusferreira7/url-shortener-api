import { AggregateRoot } from '@/core/entities/aggregate-root';
import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';

interface UserProps {
	name: string;
	email: string;
	password: string; //TODO: Verify how better auth works with password
	createdAt: Date;
	updatedAt?: Date | null;
}

export class User extends AggregateRoot<UserProps> {
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

	public static create(props: UserProps, id?: UniqueEntityId) {
		return new User(props, id);
	}
}
