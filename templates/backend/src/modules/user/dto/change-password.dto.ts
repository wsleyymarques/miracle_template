import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'A senha atual deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha atual não pode estar vazia.' })
  currentPassword: string;

  @IsString({ message: 'A nova senha deve ser uma string.' })
  @MinLength(8, { message: 'A nova senha deve ter pelo menos 8 caracteres.' })
  @IsNotEmpty({ message: 'A nova senha não pode estar vazia.' })
  newPassword: string;
}
