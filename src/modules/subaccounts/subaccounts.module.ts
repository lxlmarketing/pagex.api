import { HttpModule, Module } from '@nestjs/common';
import { SubaccountsService } from './subaccounts.service';
import { SubaccountsController } from './subaccounts.controller';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.landingi.com',
      headers: {
        apiKey: '0dd6111c-2997-11eb-ae3d-8ef3ee4aa74a'
      }
    }),
  ],
  providers: [SubaccountsService],
  controllers: [SubaccountsController],
})
export class SubaccountsModule {}
