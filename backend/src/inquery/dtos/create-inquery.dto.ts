import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateInqueryDto {
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  @IsNotEmpty()
  message: string;
}
