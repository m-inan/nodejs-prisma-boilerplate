import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import 'reflect-metadata';

import { prisma } from 'generated/prisma';
import app from 'config/express';
import { PORT } from 'config/constants';

import User from 'resolvers/User';

async function main(): Promise<void> {
	const schema = await buildSchema({
		resolvers: [User],
		emitSchemaFile: true
	});

	const server = new ApolloServer({
		schema,
		context: context => {
			return {
				prisma,
				...context
			};
		}
	});

	server.applyMiddleware({ app });

	app.listen({ port: PORT }, () =>
		console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
	);
}

main();

