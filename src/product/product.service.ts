import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductInput } from './dto/create-product.input';
import { PaginationInput } from '../dto/pagination.input';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {
  }

  async create(createProductInput: CreateProductInput) {
    return await this.productRepository.save({
      ...createProductInput,
      manufacturer: {
        id: createProductInput.manufacturerId,
      },
    });
  }

  async update(id: number, createProductInput: CreateProductInput) {
    return await this.productRepository.update(id, createProductInput);
  }

  async delete(id: number) {
    return await this.productRepository.delete(id);
  }

  async findAll(paginationInput: PaginationInput) {
    return await this.productRepository.find({
      skip: paginationInput.offset,
      take: paginationInput.limit,
      order: {
        id: paginationInput.order,
      },
    });
  }
}
