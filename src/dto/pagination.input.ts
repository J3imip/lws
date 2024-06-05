import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true })
  @IsPositive({ message: 'Limit must be a positive number' })
  @IsOptional()
  limit?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  offset?: number;

  @Field({ nullable: true })
  @IsOptional()
  order?: 'ASC' | 'DESC';
}
