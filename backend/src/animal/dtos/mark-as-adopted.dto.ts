import { IsNotEmpty, IsString } from 'class-validator';

export class MarkAsAdoptedDto {
  @IsString()
  @IsNotEmpty()
  adopterId: string;
}
