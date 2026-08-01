import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UserRoleMapper } from './user-role.mapper';
import { UserRoleRepository } from './user-role.repository';

@Injectable()
export class UserRoleService {
  constructor(
    private readonly userRoleRepository: UserRoleRepository,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async create(createUserRoleDto: CreateUserRoleDto) {
    // Check if user and role exist
    await this.userService.findById(createUserRoleDto.userId);
    await this.roleService.findById(createUserRoleDto.roleId);

    // Check if the relationship already exists
    const existing = await this.userRoleRepository.findByUserIdAndRoleId(
      createUserRoleDto.userId,
      createUserRoleDto.roleId,
    );
    if (existing) {
      throw new ConflictException(
        'Este perfil já foi atribuído a este usuário.',
      );
    }

    const userRole = await this.userRoleRepository.create(createUserRoleDto);
    return UserRoleMapper.toEntity(userRole);
  }

  async findUserRolesByUserId(userId: string) {
    // Check if user exists
    await this.userService.findById(userId);

    const userRoles = await this.userRoleRepository.findUserRolesByUserId(
      userId,
    );
    return UserRoleMapper.toEntityList(userRoles);
  }

  async remove(id: string) {
    const userRole = await this.userRoleRepository.findById(id);
    if (!userRole) {
      throw new NotFoundException('Relação perfil-usuário não encontrada.');
    }
    await this.userRoleRepository.remove(id);
  }
}
