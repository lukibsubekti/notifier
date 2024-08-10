import { Module } from '@nestjs/common';
import { HandlerListener } from './handler.listener';

@Module({
  providers: [HandlerListener],
})
export class HandlerModule {}
