import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class User {
	@Field()
	id: string;

	@Field()
	name: string;
}
