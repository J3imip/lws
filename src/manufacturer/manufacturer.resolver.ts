import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ManufacturerService } from './manufacturer.service';
import { Manufacturer } from './entities/manufacturer.entity';
import { CreateManufacturerInput } from './dto/create-manufacturer.input';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { RolesGuard } from '../auth/roles.guard';
import { IdentityRole } from '../identity/entities/identity.entity';
import { Roles } from '../auth/roles.decorator';
import { PaginationInput } from '../dto/pagination.input';

@Resolver()
@UseGuards(AccessTokenGuard, RolesGuard)
export class ManufacturerResolver {
  constructor(
    private readonly manufacturerService: ManufacturerService,
  ) {
  }

  @Mutation(() => Manufacturer)
  @Roles(IdentityRole.ADMIN)
  async createManufacturer(
    @Args('createManufacturerInput') createManufacturerInput: CreateManufacturerInput,
  ) {
    return await this.manufacturerService.create(createManufacturerInput);
  }

  @Mutation(() => Manufacturer)
  @Roles(IdentityRole.ADMIN)
  async updateManufacturer(
    @Args('id') id: string,
    @Args('createManufacturerInput') createManufacturerInput: CreateManufacturerInput,
  ) {
    return await this.manufacturerService.update(id, createManufacturerInput);
  }

  @Mutation(() => Manufacturer)
  @Roles(IdentityRole.ADMIN)
  async deleteManufacturer(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return await this.manufacturerService.delete(id);
  }

  @Query(() => [Manufacturer])
  async manufacturers(
    @Args('paginationInput', { nullable: true }) paginationInput: PaginationInput,
  ) {
    return await this.manufacturerService.findAll(paginationInput);
  }

  @Query(() => Manufacturer)
  async manufacturer(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return await this.manufacturerService.findOne(id);
  }
}
