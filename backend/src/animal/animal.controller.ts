import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { GetUser, Public } from '../auth/decorators';
import { AnimalService } from './animal.service';
import { UserRole } from '../user/enums';
import { GetAnimalsQueryDto, RegisterAnimalDto } from './dtos';
import { GetUserType } from '../user/types';

@Controller('animals')
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @Get('mine')
  getMyAnimals(@GetUser('id') userId: GetUserType['id']) {
    return this.animalService.getAnimalsByAuthorId(userId);
  }

  @Get(':id')
  @Public()
  getAnimalById(@GetUser() user: GetUserType, @Param('id') animalId: string) {
    return this.animalService.getAnimalById(animalId, user);
  }

  @Get()
  @Public()
  getAnimals(
    @Query() { limit, offset, species, uf, city }: GetAnimalsQueryDto,
  ) {
    return this.animalService.getAnimals(limit, offset, species, uf, city);
  }

  @Get()
  getPendingAnimals(@GetUser('role') role: GetUserType['role']) {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return this.animalService.getPendingAnimals();
  }

  @Post()
  registerAnimal(
    @GetUser('id') userId: GetUserType['id'],
    @Body() dto: RegisterAnimalDto,
  ) {
    return this.animalService.registerAnimal(dto, userId);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  approveAnimal(
    @GetUser('role') role: GetUserType['role'],
    @Param('id') animalId: string,
  ) {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return this.animalService.approveAnimal(animalId);
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  rejectAnimal(
    @GetUser('role') role: GetUserType['role'],
    @Param('id') animalId: string,
  ) {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return this.animalService.rejectAnimal(animalId);
  }

  @Post(':id/markasadopted')
  @HttpCode(HttpStatus.NO_CONTENT)
  markAsAdopted(
    @GetUser('id') userId: GetUserType['id'],
    @Param('id') animalId: string,
  ) {
    return this.animalService.markAsAdopted(animalId, userId);
  }
}
