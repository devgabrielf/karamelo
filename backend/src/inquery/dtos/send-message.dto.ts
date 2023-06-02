import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  content: string;
}
