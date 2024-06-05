import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RolesGuard } from '../auth/roles.guard';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { IdentityRole } from '../identity/entities/identity.entity';
import { CreateProductInput } from './dto/create-product.input';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { PaginationInput } from '../dto/pagination.input';
import { ProductFilter } from './dto/product.filter';

@Resolver()
@UseGuards(AccessTokenGuard, RolesGuard)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
  ) {
  }

  @Query(() => [Product])
  @Roles(IdentityRole.ADMIN, IdentityRole.CUSTOMER)
  async products(
    @Args('paginationInput', { nullable: true }) paginationInput: PaginationInput,
    @Args('productFilter', {nullable: true}) productFilter: ProductFilter
  ) {
    return await this.productService.findAll(paginationInput, productFilter);
  }

  @Mutation(() => Product)
  @Roles(IdentityRole.ADMIN)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return await this.productService.create(createProductInput);
  }

  @Mutation(() => Product)
  @Roles(IdentityRole.ADMIN)
  async updateProduct(
    @Args('id') id: number,
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return await this.productService.update(id, createProductInput);
  }

  @Mutation(() => Product)
  async deleteProduct(
    @Args('id') id: number,
  ) {
    return await this.productService.delete(id);
  }
}
