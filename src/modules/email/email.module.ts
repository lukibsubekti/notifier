import { DynamicModule, Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {
  static forRoot({ isGlobal = false }: {isGlobal: boolean}): DynamicModule {
    return {
      global: isGlobal,
      module: EmailModule,
    };
  }
}
