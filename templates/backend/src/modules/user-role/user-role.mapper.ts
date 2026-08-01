import { UserRoleEntity } from './entities/user-role.entity';

export class UserRoleMapper {
  static toEntity(userRole: any): UserRoleEntity {
    return {
      id: userRole.id,
      userId: userRole.userId,
      roleId: userRole.roleId,
      createdAt: userRole.createdAt,
    };
  }

  static toEntityList(userRoles: any[]): UserRoleEntity[] {
    return userRoles.map(UserRoleMapper.toEntity);
  }
}
