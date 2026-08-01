import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListQueryDto } from 'src/common/dto/list-query.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleMapper } from './role.mapper';
import { RoleRepository } from '../../shared/repository/role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.roleRepository.findByName(
      createRoleDto.name,
    );
    if (existingRole) {
      throw new ConflictException('Já existe um perfil com este nome.');
    }

    const role = await this.roleRepository.create(createRoleDto);
    return RoleMapper.toEntity(role);
  }

  async findAll(query: ListQueryDto) {
    const paginatedRoles = await this.roleRepository.findAll(query);
    return {
      data: RoleMapper.toEntityList(paginatedRoles.data),
      meta: paginatedRoles.meta,
    };
  }

  async findById(id: string) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Perfil não encontrado.');
    }
    return RoleMapper.toEntity(role);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.findById(id); // check for existence

    if (updateRoleDto.name) {
      const existingRole = await this.roleRepository.findByName(
        updateRoleDto.name,
      );
      if (existingRole && existingRole.id !== id) {
        throw new ConflictException('Já existe um perfil com este nome.');
      }
    }

    const role = await this.roleRepository.update(id, updateRoleDto);
    return RoleMapper.toEntity(role);
  }

  async remove(id: string) {
    await this.findById(id); // check for existence
    await this.roleRepository.remove(id);
  }
}
