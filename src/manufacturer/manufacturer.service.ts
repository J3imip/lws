import { Injectable, NotFoundException } from '@nestjs/common';
import { Manufacturer } from './entities/manufacturer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateManufacturerInput } from './dto/create-manufacturer.input';
import { PaginationInput } from '../dto/pagination.input';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer) private manufacturerRepository: Repository<Manufacturer>,
  ) {
  }

  async create(createManufacturerInput: CreateManufacturerInput) {
    return await this.manufacturerRepository.save(createManufacturerInput);
  }

  async update(id: string, createManufacturerInput: CreateManufacturerInput) {
    return await this.manufacturerRepository.update(id, createManufacturerInput);
  }

  async delete(id: number) {
    const manufacturer = await this.manufacturerRepository.findOneBy({id});
    if (!manufacturer) {
      throw new NotFoundException("Manufacturer to delete not found");
    }

    return await this.manufacturerRepository.delete(id);
  }

  async findAll(paginationInput: PaginationInput) {
    return await this.manufacturerRepository.find({
      relations: ['products'],
      order: { id: paginationInput.order },
      skip: paginationInput.offset,
      take: paginationInput.limit,
    })
  }

  async findOne(id: number) {
    return await this.manufacturerRepository.findOne({
      relations: ['products'],
      where: { id },
    });
  }
}
