import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { toUpperCase } from '../../common/helpers';

export class EditUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @Transform(({ value }) => toUpperCase(value))
  @IsString()
  @IsOptional()
  uf?: string;
}
