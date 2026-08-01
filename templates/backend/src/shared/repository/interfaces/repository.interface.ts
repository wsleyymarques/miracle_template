import { ListQueryDto } from '../../../common/dto/list-query.dto';
import { CreateRoleDto } from '../../../modules/role/dto/create-role.dto';
import { UpdateRoleDto } from '../../../modules/role/dto/update-role.dto';
import { CreateUserDto } from '../../../modules/user/dto/create-user.dto';
import { UpdateUserDto } from '../../../modules/user/dto/update-user.dto';
import { CreateUserRoleDto } from '../../../modules/user-role/dto/create-user-role.dto';

export interface IRoleRepository {
  create(createRoleDto: CreateRoleDto): Promise<unknown>;
  findAll(query: ListQueryDto): Promise<unknown>;
  findById(id: string): Promise<unknown>;
  findByName(name: string): Promise<unknown>;
  update(id: string, updateRoleDto: UpdateRoleDto): Promise<unknown>;
  remove(id: string): Promise<void>;
}

export interface IUserRepository {
  create(createUserDto: CreateUserDto, hashedPassword: string): Promise<unknown>;
  findAll(query: ListQueryDto): Promise<unknown>;
  findById(id: string): Promise<unknown>;
  findByEmail(email: string): Promise<unknown>;
  findByEmailWithPassword(email: string): Promise<unknown>;
  findByIdWithPassword(id: string): Promise<unknown>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<unknown>;
  updatePassword(id: string, newHashedPassword: string): Promise<unknown>;
  remove(id: string): Promise<void>;
}

export interface IUserRoleRepository {
  create(createUserRoleDto: CreateUserRoleDto): Promise<unknown>;
  findByUserIdAndRoleId(userId: string, roleId: string): Promise<unknown>;
  findUserRolesByUserId(userId: string): Promise<unknown>;
  findById(id: string): Promise<unknown>;
  remove(id: string): Promise<void>;
  findRolesByUserId(userId: string): Promise<unknown>;
}

export interface IRefreshTokenRepository {
  create(tokenHash: string, userId: string, expiresAt: Date): Promise<unknown>;
  findByTokenHash(tokenHash: string): Promise<unknown>;
  delete(id: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
}

export interface IPasswordResetCodeRepository {
  create(userId: string, code: string, expiresAt: Date): Promise<unknown>;
  findLatestByUserId(userId: string): Promise<unknown>;
  incrementAttempts(id: string): Promise<unknown>;
  delete(id: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
}
