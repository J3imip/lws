import { Injectable } from '@nestjs/common';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class CustomerService {
  constructor(@InjectRepository(Customer) private readonly customerRepository: Repository<Customer>) {
  }

  async create(createCustomerInput: CreateCustomerInput) {
    const customer = this.customerRepository.create(createCustomerInput);

    customer.passwordHash = await hash(createCustomerInput.password, 10);

    return this.customerRepository.save(customer);
  }

  findAll() {
    return this.customerRepository.find();
  }

  findOne(options: FindOptionsWhere<Customer>[] | FindOptionsWhere<Customer>) {
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
