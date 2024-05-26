import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsPositive } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field({ nullable: true })
  @IsPositive({ message: 'Limit must be a positive number' })
  @IsOptional()
  limit?: number;

  @Field({ nullable: true })
  @IsOptional()
  offset?: number;

  @Field({ nullable: true })
  @IsOptional()
  order?: 'ASC' | 'DESC';
}
