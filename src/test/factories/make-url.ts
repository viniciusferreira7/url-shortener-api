import { faker } from '@faker-js/faker';
import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';
import { Url } from '@/domain/url-shortening/enterprise/entities/url';

export function makeUrl(
	override: Partial<{
		name: string;
		value: string;
		code: string;
		isPublic: boolean;
		description?: string | null;
		authorId: UniqueEntityId;
		createdAt: Date;
		updatedAt?: Date | null;
	}> = {},
	id?: UniqueEntityId
) {
	const url = Url.create(
		{
			name: override?.name ?? faker.lorem.words(3),
			value: override?.value ?? faker.internet.url(),
			code: override?.code ?? faker.string.alphanumeric(6),
			isPublic: override?.isPublic ?? faker.datatype.boolean(),
			description: override?.description ?? faker.lorem.sentence(),
			authorId:
				override?.authorId ??
				(faker.string.uuid() as unknown as UniqueEntityId),
			createdAt: override?.createdAt ?? new Date(),
			updatedAt: override?.updatedAt ?? null,
		},
		id
	);

	return url;
}
