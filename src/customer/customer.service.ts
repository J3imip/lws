import { Injectable } from '@nestjs/common';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { Identity } from '../identity/entities/identity.entity';
import { PaginationInput } from '../dto/pagination.input';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
    private readonly authService: AuthService,
  ) {
  }

  async create(createCustomerInput: CreateCustomerInput) {
    const { phone, password, ...customerData } = createCustomerInput;

    const identity = new Identity({
      primaryID: phone,
      passwordHash: await hash(password, 10),
    });

    await this.customerRepository.manager.save(identity);

    const customer = this.customerRepository.create({
      ...customerData,
      identity: identity,
    });

    await this.customerRepository.save(customer);

    return await this.authService.login(identity);
  }

  async findAll(paginationInput: PaginationInput) {
    return this.customerRepository.find({
      take: paginationInput.limit,
      skip: paginationInput.offset,
      order: {
        id: paginationInput.order,
      },
    });
  }

  async findOne(options: FindOptionsWhere<Customer>[] | FindOptionsWhere<Customer>) {
    return this.customerRepository.findOne({ where: options });
  }

  async update(id: number, updateCustomerInput: UpdateCustomerInput) {
    const result = await this.customerRepository
      .createQueryBuilder()
      .update(Customer, updateCustomerInput)
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return plainToInstance(Customer, result.raw[0]);
  }

  async remove(id: number) {
    const result = await this.customerRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return plainToInstance(Customer, result.raw[0]);
  }
}
