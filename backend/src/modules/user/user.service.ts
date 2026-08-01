import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ListQueryDto } from 'src/common/dto/list-query.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './user.mapper';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);
    const user = await this.userRepository.create(createUserDto, hashedPassword);

    return UserMapper.toEntity(user);
  }

  async findAll(query: ListQueryDto) {
    const paginatedUsers = await this.userRepository.findAll(query);
    return {
      data: UserMapper.toEntityList(paginatedUsers.data),
      meta: paginatedUsers.meta,
    };
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return UserMapper.toEntity(user);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return UserMapper.toEntity(user);
  }

  // For internal use by AuthService
  async findByEmailWithPassword(email: string) {
    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findById(id); // Check if user exists and get mapped entity

    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('E-mail já cadastrado');
      }
    }

    const updatedUser = await this.userRepository.update(id, updateUserDto);
    return UserMapper.toEntity(updatedUser);
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findByIdWithPassword(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isPasswordMatching = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    const newHashedPassword = await this.hashPassword(
      changePasswordDto.newPassword,
    );
    await this.userRepository.updatePassword(id, newHashedPassword);
  }

  async remove(id: string) {
    await this.findById(id); // Check if user exists
    await this.userRepository.remove(id);
  }

  async forceSetPassword(id: string, newPassword: string) {
    const newHashedPassword = await this.hashPassword(newPassword);
    await this.userRepository.updatePassword(id, newHashedPassword);
  }
}
