import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { toNumber, toLowerCase, toUpperCase } from '../../common/helpers';
import { Sex, Species } from '../enums';

export class RegisterAnimalDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsUrl({ require_tld: false }, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  pictures: string[];

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  @IsNotEmpty()
  description: string;

  @Transform(({ value }) => toLowerCase(value))
  @IsEnum(Species)
  @IsNotEmpty()
  species: Species;

  @Transform(({ value }) => toUpperCase(value))
  @IsEnum(Sex)
  @IsNotEmpty()
  sex: Sex;

  @Transform(({ value }) => toNumber(value, { min: 1 }))
  @IsNumber()
  @IsOptional()
  months: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @Transform(({ value }) => toUpperCase(value))
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @IsNotEmpty()
  uf: string;
}
