import { UserEntity } from './entities/user.entity';

export class UserMapper {
  static toEntity(user: any): UserEntity {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toEntityList(users: any[]): UserEntity[] {
    return users.map(UserMapper.toEntity);
  }
}
