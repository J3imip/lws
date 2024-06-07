import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { ForbiddenException, NotFoundException, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { IdentityRole } from '../identity/entities/identity.entity';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateOrderInput } from './dto/update-order.input';
import { PaginationInput } from '../dto/pagination.input';
import { CustomerService } from '../customer/customer.service';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Resolver()
@UseGuards(AccessTokenGuard, RolesGuard)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
  ) {
  }

  @Mutation(() => Order)
  @Roles(IdentityRole.CUSTOMER)
  async placeOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @Context() context,
  ) {
    return await this.orderService.create(createOrderInput, context.req.user.id);
  }

  @Mutation(() => Order)
  @Roles(IdentityRole.ADMIN, IdentityRole.CUSTOMER)
  async updateOrder(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
  ) {
    return await this.orderService.update(id, updateOrderInput);
  }

  @Query(() => [Order])
  @Roles(IdentityRole.ADMIN, IdentityRole.CUSTOMER)
  async orders(
    @Args('paginationInput', { nullable: true }) paginationInput: PaginationInput,
    @Context() context,
  ) {
    let options: FindOptionsWhere<Order>[] | FindOptionsWhere<Order>;
    if (context.req.user.role === IdentityRole.CUSTOMER) {
      const customer = await this.customerService.findOne({ identity: { id: context.req.user.id } });
      if (!customer) {
        return [];
      }

      options = { customer: { id: customer.id } };
    }

    return await this.orderService.findAll(
      paginationInput, options,
    );
  }

  @Query(() => Order)
  @Roles(IdentityRole.CUSTOMER, IdentityRole.ADMIN)
  async order(
    @Args('id', { type: () => Int }) id: number,
    @Context() context,
  ) {
    const order = await this.orderService.findOne({ id });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const customer = await this.customerService.findOne({ identity: { id: context.req.user.id } });

    if (context.req.user.role === IdentityRole.CUSTOMER && customer.id !== order.customer.id) {
      throw new ForbiddenException('You can\'t view other customer\'s orders');
    }

    return order;
  }
}
