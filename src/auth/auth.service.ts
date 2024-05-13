import { Injectable } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Customer } from '../customer/entities/customer.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
  ) {
  }

  async validateUser(phone: string, password: string) {
    const customer = await this.customerService.findOne({ phone });

    if (customer && await compare(password, customer.passwordHash)) {
      return customer;
    }

    return null;
  }

  async login(customer: Customer) {
    return {
      token: this.jwtService.sign({
        phone: customer.phone,
        sub: customer.id,
      }),
      customer,
    };
  }
}
