import {
	Query,
	Mutation,
	Resolver,
	Ctx,
	Arg,
	InputType,
	Field
} from 'type-graphql';
import UserSchema from 'schemas/User';

import { User } from 'generated/prisma';

import { Context } from 'interfaces';

@InputType()
class UserWhereInput {
	@Field({ nullable: true })
	name?: string;
}

@Resolver(() => UserSchema)
export default class {
	@Query(() => [UserSchema])
	users(
		@Ctx() { prisma }: Context,
		@Arg('where', { nullable: true }) where: UserWhereInput
	): Promise<User[]> {
		return prisma.users({ where });
	}

	@Query(() => UserSchema)
	user(
		@Ctx() { prisma }: Context,
		@Arg('id') id: string
	): Promise<User | null> {
		return prisma.user({ id });
	}

	@Mutation(() => UserSchema)
	createUser(
		@Ctx() { prisma }: Context,
		@Arg('name') name: string
	): Promise<User> {
		return prisma.createUser({ name });
	}
}
