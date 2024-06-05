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
import { OrderProduct } from './entities/order-product.entity';
import { Product } from '../product/entities/product.entity';

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

    const order = this.orderRepository.create({ customer, ...createOrderInput });

    const orderProducts = createOrderInput.products.map((orderProductInput) => {
      return new OrderProduct({
        order,
        product: {
          id: orderProductInput.productID,
        } as Product,
        productQuantity: orderProductInput.productQuantity,
      });
    });

    order.orderProducts = orderProducts;

    const res = await this.orderRepository.save(order);
    await this.orderRepository.manager.save(orderProducts);

    return res
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

  async findAll(paginationInput: PaginationInput = null, options: FindOptionsWhere<Order>[] | FindOptionsWhere<Order> = null) {
    const limit = paginationInput?.limit ?? 10; // Значение по умолчанию - 10
    const offset = paginationInput?.offset ?? 0; // Значение по умолчанию - 0
    const order = paginationInput?.order ?? 'ASC'; // Значение по умолчанию - ASC

    return this.orderRepository.find({
      relations: ['customer', 'orderProducts', 'orderProducts.product'],
      take: limit,
      skip: offset,
      order: {
        id: order,
      },
      where: options,
    });
  }


  async findOne(options: FindOptionsWhere<Order>[] | FindOptionsWhere<Order>) {
    return await this.orderRepository.findOne({
      relations: ['customer'],
      where: options,
    });
  }
}
