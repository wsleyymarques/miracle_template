import { IsEmail, IsNotEmpty, IsString, Length, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsEmail({}, { message: 'Por favor, forneça um email válido.' })
    @IsNotEmpty({ message: 'O email não pode estar vazio.' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 6, { message: 'O código deve ter exatamente 6 dígitos.'})
    @Matches(/^\d{6}$/, { message: 'O código deve conter apenas números.'})
    code: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'A nova senha deve ter pelo menos 8 caracteres.'})
    newPassword: string;
}
