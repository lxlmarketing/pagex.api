import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customer.controller';
import { CustomerRepository } from './customer.repository';
import { CustomersService } from './customer.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.landingi.com',
      headers: {
        apiKey: '0dd6111c-2997-11eb-ae3d-8ef3ee4aa74a',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }),
    TypeOrmModule.forFeature([CustomerRepository]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
