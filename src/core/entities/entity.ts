import { UniqueEntityId } from './value-object/unique-entity-id';

export abstract class Entity<Props> {
	protected _id: UniqueEntityId;
	protected props: Props;

	protected constructor(props: Props, id?: UniqueEntityId) {
		this.props = props;
		this._id = id ?? new UniqueEntityId(id);
	}

	get id() {
		return this._id;
	}

	public equals(entity: Entity<unknown>) {
		if (entity === this) return true;

		if (entity instanceof Entity && this._id === entity._id) return true;

		return false;
	}
}
