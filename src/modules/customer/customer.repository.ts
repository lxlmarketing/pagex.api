import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<any> {
    try {
      const response = await this.save(createCustomerDto);
      return response;
    } catch (error) {
      console.log('error here: \n', error);

      if (error.code === '23505') {
        throw new ConflictException('Customer already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getByToken(token: string): Promise<Customer> {
    const customer = await this.findOne({ resetToken: token });

    if (!customer) {
      throw new NotFoundException('Token is invalid');
    }
    return customer;
  }

  async getByMail(email: string): Promise<boolean | Customer> {
    const customer = await this.findOne({ hotmartEmail: email });

    if (!customer) {
      return false;
    }
    return customer;
  }
}
