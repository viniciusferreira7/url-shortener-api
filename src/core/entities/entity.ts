export abstract class Entity<Props> {
	protected _id: any;
	protected props: Props;

	protected constructor(props: Props, id?: any) {
		this.props = props;
		this._id = id;
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
