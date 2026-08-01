import { Injectable } from '@nestjs/common';
import { ListQueryDto } from '../../common/dto/list-query.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../../modules/user/dto/create-user.dto';
import { UpdateUserDto } from '../../modules/user/dto/update-user.dto';
import { IUserRepository } from './interfaces/repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get prismaClient(): any {
    return this.prisma as any;
  }

  private readonly userSafeSelect = {
    id: true,
    name: true,
    email: true,
    createdAt: true,
    updatedAt: true,
  };

  async create(createUserDto: CreateUserDto, hashedPassword) {
    return this.prismaClient.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        hashedPassword: hashedPassword,
      },
      select: this.userSafeSelect,
    });
  }

  async findAll(query: ListQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [users, total] = await this.prismaClient.$transaction([
      this.prismaClient.user.findMany({
        select: this.userSafeSelect,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaClient.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return this.prismaClient.user.findUnique({
      where: { id },
      select: this.userSafeSelect,
    });
  }

  async findByIdWithPassword(id: string) {
    return this.prismaClient.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prismaClient.user.findUnique({
      where: { email },
      select: this.userSafeSelect,
    });
  }

  async findByEmailWithPassword(email: string) {
    return this.prismaClient.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaClient.user.update({
      where: { id },
      data: updateUserDto,
      select: this.userSafeSelect,
    });
  }

  async updatePassword(id: string, newHash: string): Promise<void> {
    await this.prismaClient.user.update({
      where: { id },
      data: {
        hashedPassword: newHash,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prismaClient.user.delete({
      where: { id },
    });
  }
}
