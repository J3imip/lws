import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { CustomerService } from '../customer/customer.service';
import { UpdateOrderInput } from './dto/update-order.input';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { PaginationInput } from '../dto/pagination.input';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    private readonly customerService: CustomerService,
  ) {
  }

  async create(createOrderInput: CreateOrderInput, identityID: number) {
    const customer = await this.customerService.findOne({ identity: { id: identityID } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const order = this.orderRepository.create({
      ...createOrderInput,
      customer,
    });
    return await this.orderRepository.save(order);
  }

  async update(id: number, updateOrderInput: UpdateOrderInput) {
    const result = await this.orderRepository
      .createQueryBuilder()
      .update(Order, updateOrderInput)
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return plainToInstance(Order, result.raw[0]);
  }

  async findAll(paginationInput: PaginationInput, options: FindOptionsWhere<Order>[] | FindOptionsWhere<Order> = null) {
    // return this.orderRepository.find({
    //   take: paginationInput.limit,
    //   skip: paginationInput.offset,
    //   order: {
    //     id: paginationInput.order,
    //   },
    //   where: options,
    // });
    return this.orderRepository
      .createQueryBuilder()
      .where(options)
      .take(paginationInput.limit)
      .skip(paginationInput.offset)
      .orderBy('Order.id', paginationInput.order)
      .leftJoinAndSelect('Order.customer', 'customer')
      .getMany();
  }

  async findOne(options: FindOptionsWhere<Order>[] | FindOptionsWhere<Order>) {
    return await this.orderRepository
      .createQueryBuilder()
      .where(options)
      .leftJoinAndSelect('Order.customer', 'customer')
      .getOne();
  }
}
