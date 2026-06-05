import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HealthStatus {
  @Field()
  service!: string;

  @Field()
  status!: string;

  @Field()
  timestamp!: Date;
}
