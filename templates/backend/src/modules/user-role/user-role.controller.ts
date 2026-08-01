import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiResponse } from '../../common/responses/api-response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UserRoleService } from './user-role.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('user-roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post()
  async create(@Body() createUserRoleDto: CreateUserRoleDto) {
    const userRole = await this.userRoleService.create(createUserRoleDto);
    return new ApiResponse('Perfil atribuído ao usuário com sucesso', userRole);
  }

  @Get('user/:userId')
  async findUserRoles(@Param('userId', ParseUUIDPipe) userId: string) {
    const userRoles = await this.userRoleService.findUserRolesByUserId(userId);
    return new ApiResponse(
      'Perfis do usuário listados com sucesso',
      userRoles,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.userRoleService.remove(id);
    return new ApiResponse('Perfil removido do usuário com sucesso');
  }
}
