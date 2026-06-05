import { join } from 'path';

import { ApolloDriverConfig } from '@nestjs/apollo';

export const buildGraphqlConfig = (): ApolloDriverConfig => ({
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  path: process.env.GRAPHQL_PATH ?? '/graphql',
  playground: process.env.GRAPHQL_PLAYGROUND !== 'false',
  sortSchema: true,
  introspection: true,
});
