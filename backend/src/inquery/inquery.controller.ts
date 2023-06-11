import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators';
import { CreateInqueryDto, SendMessageDto } from './dtos';
import { GetUserType } from '../user/types';
import { InqueryService } from './inquery.service';

@Controller('inqueries')
export class InqueryController {
  constructor(private inqueryService: InqueryService) {}

  @Get('mine')
  getMyInqueries(@GetUser('id') userId: GetUserType['id']) {
    return this.inqueryService.getMyInqueries(userId);
  }

  @Get(':id')
  getInqueryById(
    @GetUser('id') userId: GetUserType['id'],
    @Param('id') inqueryId: string,
  ) {
    return this.inqueryService.getInqueryById(inqueryId, userId);
  }

  @Get('byanimal/:id')
  getInqueriesByAnimalId(
    @GetUser('id') userId: GetUserType['id'],
    @Param('id') animalId: string,
  ) {
    return this.inqueryService.getInqueriesByAnimalId(animalId, userId);
  }

  @Post('create/:id')
  createInquery(
    @GetUser('id') userId: GetUserType['id'],
    @Param('id') animalId: string,
    @Body() dto: CreateInqueryDto,
  ) {
    return this.inqueryService.createInquery(dto, animalId, userId);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  approveInquery(
    @GetUser('id') userId: GetUserType['id'],
    @Param('id') inqueryId: string,
  ) {
    return this.inqueryService.approveInquery(inqueryId, userId);
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  rejectInquery(
    @GetUser('id') userId: GetUserType['id'],
    @Param('id') inqueryId: string,
  ) {
    return this.inqueryService.rejectInquery(inqueryId, userId);
  }

  @Get(':id/messages')
  getMessagesByInqueryId(
    @GetUser('id') userId: GetUserType['id'],
    @Param('id') inqueryId: string,
  ) {
    return this.inqueryService.getMessagesByInqueryId(inqueryId, userId);
  }

  @Post(':id/messages')
  sendMessage(
    @GetUser('id') userId: GetUserType['id'],
    @Param('id') inqueryId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.inqueryService.sendMessage(dto, inqueryId, userId);
  }
}
