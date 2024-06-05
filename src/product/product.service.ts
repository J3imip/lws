import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateProductInput } from './dto/create-product.input';
import { PaginationInput } from '../dto/pagination.input';
import { ProductFilter } from './dto/product.filter';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

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

  async findAll(paginationInput: PaginationInput, productFilter: ProductFilter) {
    const whereConditions: FindOptionsWhere<Product>[] | FindOptionsWhere<Product> = {};

    if (productFilter?.onlyStored) {
      whereConditions.warehouseProducts = {
        product: Not(IsNull())
      };
    }

    return await this.productRepository.find({
      relations: ['warehouseProducts'],
      skip: paginationInput.offset,
      take: paginationInput.limit,
      order: {
        id: paginationInput.order,
      },
      where: whereConditions,
    });
  }
}
