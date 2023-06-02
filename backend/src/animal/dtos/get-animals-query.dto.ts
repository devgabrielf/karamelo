import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { toNumber, toLowerCase, toUpperCase } from '../../common/helpers';
import { Species } from '../enums';

export class GetAnimalsQueryDto {
  @Transform(({ value }) => toNumber(value, { default: 12, min: 1, max: 100 }))
  @IsNumber()
  @IsOptional()
  limit = 12;

  @Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
  @IsNumber()
  @IsOptional()
  offset = 0;

  @Transform(({ value }) => toLowerCase(value))
  @IsEnum(Species)
  @IsOptional()
  species: Species;

  @IsString()
  @IsOptional()
  city: string;

  @Transform(({ value }) => toUpperCase(value))
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @IsOptional()
  uf: string;
}
