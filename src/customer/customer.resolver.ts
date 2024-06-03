import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { RolesGuard } from '../auth/roles.guard';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { Roles } from '../auth/roles.decorator';
import { IdentityRole } from '../identity/entities/identity.entity';
import { PaginationInput } from '../dto/pagination.input';
import { LoginResponse } from '../auth/dto/login-response';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {
  }

  @Mutation(() => LoginResponse)
  async createCustomer(
    @Args('createCustomerInput') createCustomerInput: CreateCustomerInput,
  ) {
    return await this.customerService.create(createCustomerInput);
  }

  @Query(() => [Customer], { name: 'customerList' })
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(IdentityRole.ADMIN)
  async findAll(@Args('paginationInput', { nullable: true }) paginationInput: PaginationInput) {
    return await this.customerService.findAll(paginationInput);
  }

  @Query(() => Customer, { name: 'customer' })
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(IdentityRole.CUSTOMER, IdentityRole.ADMIN)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @Context() context,
  ) {
    if (context.req.user.role === IdentityRole.CUSTOMER && context.req.user.id !== id) {
      throw new ForbiddenException('Forbidden resource');
    }
    return await this.customerService.findOne({ id });
  }

  @Mutation(() => Customer)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(IdentityRole.CUSTOMER)
  async updateCustomer(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput,
    @Context() context,
  ) {
    if (context.req.user.id !== id) {
      throw new ForbiddenException('Forbidden resource');
    }

    return await this.customerService.update(id, updateCustomerInput);
  }

  @Mutation(() => Customer, { nullable: true })
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(IdentityRole.ADMIN)
  async removeCustomer(@Args('id', { type: () => Int }) id: number) {
    return await this.customerService.remove(id);
  }
}
