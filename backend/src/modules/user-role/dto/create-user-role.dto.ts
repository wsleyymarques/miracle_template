import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { message: 'userId deve ser um UUID válido.' })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { message: 'roleId deve ser um UUID válido.' })
  roleId: string;
}
