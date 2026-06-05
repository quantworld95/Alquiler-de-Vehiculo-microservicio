import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  environment: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  graphqlPath: process.env.GRAPHQL_PATH ?? '/graphql',
  graphqlPlayground: process.env.GRAPHQL_PLAYGROUND !== 'false',
}));
