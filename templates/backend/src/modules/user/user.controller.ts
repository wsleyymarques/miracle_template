import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ListQueryDto } from '../../common/dto/list-query.dto';
import { ApiResponse } from '../../common/responses/api-response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return new ApiResponse('Usuário criado com sucesso', user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(@Query() query: ListQueryDto) {
    const paginatedUsers = await this.userService.findAll(query);
    return new ApiResponse('Usuários listados com sucesso', paginatedUsers);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findById(id);
    return new ApiResponse('Usuário encontrado', user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    if (currentUser.sub !== id && !currentUser.roles.includes('admin')) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este usuário.',
      );
    }
    const user = await this.userService.update(id, updateUserDto);
    return new ApiResponse('Usuário atualizado com sucesso', user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    if (currentUser.sub !== id) {
      throw new ForbiddenException('Você só pode alterar a sua própria senha.');
    }
    await this.userService.changePassword(id, changePasswordDto);
    return new ApiResponse('Senha alterada com sucesso');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.remove(id);
    return new ApiResponse('Usuário removido com sucesso');
  }
}
