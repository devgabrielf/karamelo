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
import {
  GetAnimalsQueryDto,
  MarkAsAdoptedDto,
  RegisterAnimalDto,
} from './dtos';
import { GetUserType } from '../user/types';
import { AnimalStatus } from './enums';

@Controller('animals')
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @Get('mine')
  getMyAnimals(@GetUser('id') userId: GetUserType['id']) {
    return this.animalService.getAnimalsByAuthorId(userId);
  }

  @Get()
  @Public()
  getAnimals(
    @Query() { limit, offset, species, uf, city }: GetAnimalsQueryDto,
  ) {
    return this.animalService.getAnimals(limit, offset, species, uf, city);
  }

  @Get('pending')
  getPendingAnimals(@GetUser('role') role: GetUserType['role']) {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    return this.animalService.getPendingAnimals();
  }

  @Get(':id')
  @Public()
  getAnimalById(@GetUser() user: GetUserType, @Param('id') animalId: string) {
    return this.animalService.getAnimalById(animalId, user);
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
      throw new ForbiddenException('ACCESS_DENIED');
    }

    return this.animalService.evaluteAnimal(animalId, AnimalStatus.APPROVED);
  }

  @Post(':id/disapprove')
  @HttpCode(HttpStatus.NO_CONTENT)
  rejectAnimal(
    @GetUser('role') role: GetUserType['role'],
    @Param('id') animalId: string,
  ) {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    return this.animalService.evaluteAnimal(animalId, AnimalStatus.REJECTED);
  }

  @Post(':id/mark-as-adopted')
  @HttpCode(HttpStatus.NO_CONTENT)
  markAsAdopted(
    @GetUser('id') userId: GetUserType['id'],
    @Param('id') animalId: string,
    @Body() dto: MarkAsAdoptedDto,
  ) {
    return this.animalService.markAsAdopted(dto, animalId, userId);
  }
}
