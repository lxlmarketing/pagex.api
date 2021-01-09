import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
  NotAcceptableException,
} from '@nestjs/common';
import { Customer } from './customer.entity';
import { CustomersService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { HotmartHookDto } from './dtos/hotmart-hook.dto';
import * as generator from 'generate-password';
import { ResetEmailDto } from './dtos/reset-email.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Get()
  async getCustomers(): Promise<Customer[]> {
    return this.customerService.getCustomers();
  }

  @Get(':id')
  async getCustomerById(@Param('id') id: string): Promise<Customer> {
    return this.customerService.getCustomerById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.createCustomerWithMail(createCustomerDto);
  }

  @Post('/create')
  @UsePipes(ValidationPipe)
  async createRawCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Post('/change-email')
  @UsePipes(ValidationPipe)
  async resetEmail(@Body() resetEmailDto: ResetEmailDto): Promise<any> {
    return this.customerService.resetEmail(resetEmailDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string): Promise<any> {
    return this.customerService.deleteCustomer(id);
  }

  @Post('/hook')
  @UsePipes(ValidationPipe)
  async listenToHook(@Body() hotmartHookDto: HotmartHookDto): Promise<any> {
    const { name, email } = hotmartHookDto;

    const isNewSubscription = await this.customerService.checkCustomerExistByMail(
      email,
    );
    if (isNewSubscription === false) {
      const pageXData = {
        name,
        email,
        password: `@2${generator.generate({
          length: 8,
          numbers: true,
          excludeSimilarCharacters: true,
        })}`,
        language: 'en',
        editor: '1',
        active: '1',
      };
      return this.customerService.createCustomerOnPagex(pageXData);
    }
    throw new NotAcceptableException('Account already exists - ', email);
  }
}
