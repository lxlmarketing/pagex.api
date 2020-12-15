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
  Logger,
} from '@nestjs/common';
import { Customer } from './customer.entity';
import { CustomersService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { HotmartHookDto } from './dtos/hotmart-hook.dto';
import * as generator from 'generate-password';
import { ResetEmailDto } from './dtos/reset-email.dto';
import { Cron, Interval } from '@nestjs/schedule';
import { addSeconds, isAfter } from 'date-fns';
import { PaymentStatus } from './payment-status.enum';

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

  @Post('/canceled')
  async listenToHookSubscriptionCanceled(@Body() body: any): Promise<any> {
    return this.customerService.customerCanceledPayment(body.email);

    // const isNewSubscription = await this.customerService.checkCustomerExistByMail(
    //   email,
    // );
    // if (isNewSubscription === false) {
    //   // const pageXData = {
    //   //   name,
    //   //   email,
    //   //   password: `@2${generator.generate({
    //   //     length: 8,
    //   //     numbers: true,
    //   //     excludeSimilarCharacters: true,
    //   //   })}`,
    //   //   language: 'en',
    //   //   editor: '1',
    //   //   active: '1',
    //   // };
    //   const payload: CreateCustomerDto = {
    //     name: name,
    //     hotmartEmail: email,
    //     pagexEmail: email,
    //     password: `@2${generator.generate({
    //       length: 8,
    //       numbers: true,
    //       excludeSimilarCharacters: true,
    //     })}`,
    //     pagexId: '',
    //     active: '1',
    //   };
    //   await this.customerService.createCustomer(payload);
    //   // return await this.customerService.createCustomerOnPagex(payload);
    // } else {
    //   await this.customerService.createUnapprovedPayment(email);
    // }
  }

  @Post('/subscription-canceled')
  @UsePipes(ValidationPipe)
  async listenToHookUnapprovedPayment(
    @Body() hotmartHookDto: HotmartHookDto,
  ): Promise<any> {
    const { name, email } = hotmartHookDto;

    const pageXData = {
      name,
      email,
      language: 'en',
      editor: '0',
      active: '0',
    };

    return this.customerService.updateCustomerOnPagex(email, pageXData);
  }

  // @Cron('* * */12 * * *') // A cada 12 horas todo dia
  // async handleCron(): Promise<any> {
  //   const unapprovedPayments = await this.customerService.getUnapprovedPayments();
  //   const logger = new Logger('Cron');

  //   logger.warn('Rodando o cron-job');
  //   unapprovedPayments.map(async unapay => {
  //     const customer = await this.customerService.getCustomerById(
  //       unapay.customerId,
  //     );
  //     const { name, hotmartEmail } = customer;

  //     logger.warn('Pecorendo os pagamentos não aprovados...');
  //     const compareDate = addSeconds(unapay.createdAt, 3);
  //     if (isAfter(Date.now(), compareDate)) {
  //       logger.warn('Verificando se já passou 3 dias');
  //       await this.customerService.updateCustomer(unapay.customerId, {
  //         active: false,
  //       });
  //       await this.customerService
  //         .deleteUnapprovedPayment(unapay.id)
  //         .then(async () => {
  //           logger.warn(
  //             `Deletando o 'UnapprovedPayment${unapay.id}' e enviando o email de conta suspensa para ${customer.hotmartEmail}`,
  //           );
  //           await this.customerService.sendSuspendedAccountEmail(
  //             hotmartEmail,
  //             name,
  //           );
  //         });
  //     }
  //   });
  // }
}
