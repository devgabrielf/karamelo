import { Module } from '@nestjs/common';
import { InqueryController } from './inquery.controller';
import { InqueryService } from './inquery.service';

@Module({
  controllers: [InqueryController],
  providers: [InqueryService],
})
export class InqueryModule {}
