import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {
  }

  @Mutation(() => Customer)
  async createCustomer(@Args('createCustomerInput') createCustomerInput: CreateCustomerInput) {
    return await this.customerService.create(createCustomerInput);
  }

  @Query(() => [Customer], { name: 'customerList' })
  findAll() {
    return this.customerService.findAll();
  }

  @Query(() => Customer, { name: 'customer' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.customerService.findOne({id});
  }

  @Mutation(() => Customer)
  async updateCustomer(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput,
  ) {
    return await this.customerService.update(id, updateCustomerInput);
  }

  @Mutation(() => Customer, { nullable: true })
  async removeCustomer(@Args('id', { type: () => Int }) id: number) {
    return await this.customerService.remove(id);
  }
}
