import { faker } from '@faker-js/faker';
import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';
import { Author } from '@/domain/url-shortening/enterprise/entities/author';

export function makeAuthor(
	override: Partial<{
		name: string;
		email: string;
		password: string;
		createdAt: Date;
		updatedAt?: Date | null;
	}> = {},
	id?: UniqueEntityId
) {
	const name = override?.name ?? faker.person.firstName();

	const author = Author.create(
		{
			name,
			email:
				override?.email ??
				faker.internet.email({
					firstName: name,
					lastName: faker.person.lastName(),
				}),
			password: override?.password ?? faker.internet.password({}),
			createdAt: override?.createdAt ?? new Date(),
			updatedAt: override?.updatedAt ?? null,
		},
		id
	);

	return author;
}
