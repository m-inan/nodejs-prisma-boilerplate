import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export default class Post {
	@Field()
	id: string;

	@Field()
	status: Status;

	@Field()
	title: string;

	@Field()
	slug: string;

	@Field()
	content: string;
}

enum Status {
	Published,
	Draft,
	Trash
}
