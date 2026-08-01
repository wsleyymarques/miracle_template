import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserRoleDto } from '../../modules/user-role/dto/create-user-role.dto';
import { IUserRoleRepository } from './interfaces/repository.interface';

@Injectable()
export class UserRoleRepository implements IUserRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get prismaClient(): any {
    return this.prisma as any;
  }

  async create(createUserRoleDto: CreateUserRoleDto) {
    return this.prismaClient.userRole.create({
      data: createUserRoleDto,
    });
  }

  /**
   * Finds all roles associated with a given user ID.
   * This is a key method for the AuthService to gather roles during login.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of UserRole objects, with the related Role object included.
   */
  async findRolesByUserId(userId: string) {
    return this.prismaClient.userRole.findMany({
      where: { userId },
      include: {
        role: true, // Include the full Role object
      },
    });
  }

  async findByUserIdAndRoleId(userId: string, roleId: string) {
    return this.prismaClient.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });
  }

  async findUserRolesByUserId(userId: string) {
    return this.prismaClient.userRole.findMany({
      where: { userId },
    });
  }

  async findById(id: string) {
    return this.prismaClient.userRole.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    await this.prismaClient.userRole.delete({
      where: { id },
    });
  }
}
