import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RolesGuard } from '../auth/roles.guard';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { IdentityRole } from '../identity/entities/identity.entity';
import { CreateProductInput } from './dto/create-product.input';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

@Resolver()
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(IdentityRole.ADMIN)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
  ) {
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return await this.productService.create(createProductInput);
  }

  @Mutation(() => Product)
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
