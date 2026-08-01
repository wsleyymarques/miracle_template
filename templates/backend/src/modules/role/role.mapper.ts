import { RoleEntity } from './entities/role.entity';

export class RoleMapper {
  static toEntity(role: any): RoleEntity {
    return {
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  static toEntityList(roles: any[]): RoleEntity[] {
    return roles.map(RoleMapper.toEntity);
  }
}
