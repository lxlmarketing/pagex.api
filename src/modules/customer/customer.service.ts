/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-const */
import {
  BadRequestException,
  HttpService,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository } from './customer.repository';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { PagexRegisterDto } from './dtos/pagex-register.dto';
import { PagexUpdateDto } from './dtos/pagex-update.dto';
import { MailerService } from '@nestjs-modules/mailer';

import { v4 as uuidv4 } from 'uuid';
import { ResetEmailDto } from './dtos/reset-email.dto';
import { UnapprovedPaymentRepository } from './unapproved-payment.repository';
import { UnapprovedPayment } from './unapproved-payment.entity';

import { pt } from 'date-fns/locale';
import { format } from 'date-fns';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(UnapprovedPaymentRepository)
    private readonly unapprovedPaymentRepository: UnapprovedPaymentRepository,

    private readonly httpService: HttpService,
    private readonly mailerService: MailerService,
  ) {}

  async getCustomers(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async getCustomerById(id: string): Promise<Customer> {
    await this.checkCustomerExist(id);
    return this.customerRepository.findOne(id);
  }

  async resetEmail(resetEmailDto: ResetEmailDto): Promise<any> {
    console.log('entrou, buscando usuário');

    const customer = await this.customerRepository.getByToken(
      resetEmailDto.token,
    );

    console.log('encontrado, user:', customer);

    customer.pagexEmail = resetEmailDto.email;
    customer.active = true;
    customer.resetToken = '';

    const payload: PagexRegisterDto = {
      name: customer.name,
      email: customer.pagexEmail,
      password: customer.password,
      language: 'en',
      editor: '1',
      active: '1',
    };

    console.log('payload da nova subaccount');

    return await this.createOnPagexByWebForm(payload, customer);
  }

  async createCustomerWithoutLandingiAccount(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    console.log('pré criaçao do customer');

    const customer = await this.customerRepository.createCustomer(
      createCustomerDto,
    );
    console.log('\n chegou e criou');

    return await this.mailerService.sendMail({
      from: 'contato@pagex.com.br',
      to: createCustomerDto.hotmartEmail,
      subject: 'Redefinir email',
      template: 'reset_email',
      context: {
        name: createCustomerDto.name.split(' ')[0],
        email: createCustomerDto.hotmartEmail,
        link: `https://pagex.app/reset?token=${customer.resetToken}`,
      },
    });
  }

  async createCustomerWithMail(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    await this.customerRepository.createCustomer(createCustomerDto);
    return await this.mailerService.sendMail({
      from: 'contato@pagex.com.br',
      to: createCustomerDto.hotmartEmail,
      subject: 'Nova conta PageX',
      template: 'new_account',
      context: {
        name: createCustomerDto.name.split(' ')[0],
        email: createCustomerDto.hotmartEmail,
        password: createCustomerDto.password,
      },
    });
  }

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return await this.customerRepository.createCustomer(createCustomerDto);
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    await this.checkCustomerExist(id);

    await this.customerRepository.update(id, updateCustomerDto);
    return this.getCustomerById(id);
  }

  async deleteCustomer(id: string): Promise<any> {
    await this.checkCustomerExist(id);

    const customer = await this.getCustomerById(id);
    const pagexId = customer.pagexId;

    await this.httpService
      .delete(`subaccounts/${pagexId}`)
      .toPromise()
      .then(
        async res => {
          if (res.status === 200) {
            await this.customerRepository.delete(id);
          }
        },
        async err => {
          console.log(err);
          throw new BadRequestException('');
        },
      );
  }

  async checkCustomerExist(id: string): Promise<any> {
    const customer = await this.customerRepository.findOne(id);

    if (!customer) {
      throw new NotFoundException(`Customer does not exist`);
    }
  }

  async checkCustomerExistByMail(email: string): Promise<boolean | Customer> {
    const customer = await this.customerRepository.getByMail(email);

    return customer;
  }

  async createOnPagexByWebForm(
    pagexRegisterDto: PagexRegisterDto,
    customer: Customer,
  ): Promise<any> {
    const params = new URLSearchParams({
      email: pagexRegisterDto.email,
      name: pagexRegisterDto.name,
      language: pagexRegisterDto.language,
      password: pagexRegisterDto.password,
      editor: pagexRegisterDto.editor,
      active: pagexRegisterDto.active,
    });

    await this.httpService
      .post('subaccounts', params)
      .toPromise()
      .then(
        async res => {
          console.log('Subaccount Criada');
          console.log('resposta => ', res.data);

          if (res.status === 200) {
            const data = res.data;
            let link = data._links.self.href.split('/');
            let subAccountId = link[link.length - 1];

            const pagexUpdateDto: PagexUpdateDto = {
              pagexEmail: data.email,
              pagexId: subAccountId,
              resetToken: null,
            };
            console.log('atualizando dados do usuário no banco');

            await this.customerRepository.update(customer.id, pagexUpdateDto);
            console.log(
              'usuário no banco atualizado, enviar e-mail de nova conta',
            );

            return await this.mailerService.sendMail({
              from: 'contato@pagex.com.br',
              to: customer.hotmartEmail,
              subject: 'Nova conta PageX',
              template: 'new_account',
              context: {
                name: customer.name.split(' ')[0],
                email: customer.pagexEmail,
                password: customer.password,
              },
            });
          }
        },
        async err => {
          const { error } = err.response.data;
          throw new BadRequestException(error);
        },
      );
  }

  async createCustomerOnPagex(
    pagexRegisterDto: PagexRegisterDto,
  ): Promise<any> {
    const params = new URLSearchParams({
      email: pagexRegisterDto.email,
      name: `${pagexRegisterDto.name} - ${pagexRegisterDto.email}`,
      language: pagexRegisterDto.language,
      password: pagexRegisterDto.password,
      editor: pagexRegisterDto.editor,
      active: pagexRegisterDto.active,
    });

    await this.httpService
      .post('subaccounts', params)
      .toPromise()
      .then(
        async res => {
          console.log(
            'caiu no 200, ta no pagex mesmo com com conta na landingi',
          );

          if (res.status === 200) {
            const data = res.data;
            let link = data._links.self.href.split('/');
            let subAccountId = link[link.length - 1];

            const payload: CreateCustomerDto = {
              name: `${pagexRegisterDto.name} - ${pagexRegisterDto.email}`,
              password: pagexRegisterDto.password,
              hotmartEmail: data.email,
              pagexId: subAccountId,
              active: data.active,
            };

            await this.createCustomerWithMail(payload);
          }
        },
        async err => {
          console.log('caiu na falha, esse é o payload', err.response);
          console.log('caiu na falha, esse é o erro', err.response.data);

          const { error } = err.response.data;

          if (error === 'Email already in use') {
            const payload: CreateCustomerDto = {
              hotmartEmail: pagexRegisterDto.email,
              active: pagexRegisterDto.active,
              name: `${pagexRegisterDto.name} - ${pagexRegisterDto.email}`,
              pagexEmail: '',
              password: pagexRegisterDto.password,
              resetToken: uuidv4(),
            };

            await this.createCustomerWithoutLandingiAccount(payload);
          }

          throw new BadRequestException(error);
        },
      );
  }

  async customerCanceledPayment(email: string): Promise<any> {
    // const customer = await this.checkCustomerExistByMail(email);

    // if (customer) {
    // const landingiMail = customer.pagexEmail
    //   ? customer.pagexEmail
    //   : customer.hotmartEmail;

    //TODO cron logic

    const date = new Date();
    const payday = `${date.getDate() + 3}/${date.getMonth() +
      1}/${date.getFullYear()}`;

    return await this.mailerService.sendMail({
      from: 'contato@pagex.com.br',
      to: email,
      subject: 'Compra não aprovada',
      template: 'unapproved_payment',
      context: { payday },
    });
    // }
  }

  // Temporary method
  async updateCustomerOnPagex(email: string, data: any): Promise<any> {
    const customer = await this.customerRepository.findOne({
      hotmartEmail: email,
    });

    const params = new URLSearchParams(data);
    try {
      await this.httpService
        .post(`/subaccounts/${customer.pagexId}`, params)
        .toPromise()
        .then(
          async res => {
            console.log('teste');

            if (res.status == 200) {
              await this.customerRepository.update(customer.id, {
                active: false,
              });
              return await this.mailerService.sendMail({
                from: 'contato@pagex.com.br',
                to: email,
                subject: 'Cancelamento de Conta',
                template: 'canceled_subscription',
              });
            }
          },
          async err => {
            const { error } = err.response.data;
            throw new BadRequestException(
              'Subscription Canceled Error: ',
              error,
            );
          },
        );
    } catch (error) {
      console.log(error);

      throw new NotFoundException('Error on Subscription canceled: ', error);
    }
  }

  async createUnapprovedPayment(email: string): Promise<any> {
    const customer = await this.customerRepository.findOne({
      hotmartEmail: email,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const unapprovedPayment = this.unapprovedPaymentRepository.create({
      customerId: customer.id,
      pagexId: customer.pagexId,
    });

    return await this.unapprovedPaymentRepository
      .save(unapprovedPayment)
      .then(async res => {
        const payday = format(res.createdAt, 'dd', { locale: pt });
        return await this.mailerService.sendMail({
          from: 'contato@pagex.com.br',
          to: email,
          subject: 'Pagamento não aprovado',
          template: 'unapproved_payment.hbs',
          context: {
            name: customer.name.split(' ')[0],
            payday,
          },
        });
      });
  }

  async sendSuspendedAccountEmail(email: string, name: string): Promise<any> {
    return await this.mailerService.sendMail({
      from: 'contato@pagex.com.br',
      to: email,
      subject: 'Conta suspensa',
      template: 'suspended_account.hbs',
      context: {
        name: name.split(' ')[0],
      },
    });
  }

  async getUnapprovedPayments(): Promise<UnapprovedPayment[]> {
    return this.unapprovedPaymentRepository.find();
  }

  async deleteUnapprovedPayment(id: number): Promise<any> {
    return this.unapprovedPaymentRepository.delete(id);
  }
}
