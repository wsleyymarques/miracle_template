import { Injectable } from '@nestjs/common';
import { ListQueryDto } from '../../common/dto/list-query.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from '../../modules/role/dto/create-role.dto';
import { UpdateRoleDto } from '../../modules/role/dto/update-role.dto';
import { IRoleRepository } from './interfaces/repository.interface';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get prismaClient(): any {
    return this.prisma as any;
  }

  async create(createRoleDto: CreateRoleDto) {
    return this.prismaClient.role.create({
      data: createRoleDto,
    });
  }

  async findAll(query: ListQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [roles, total] = await this.prismaClient.$transaction([
      this.prismaClient.role.findMany({
        skip,
        take: Number(limit),
        orderBy: { name: 'asc' },
      }),
      this.prismaClient.role.count(),
    ]);

    return {
      data: roles,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return this.prismaClient.role.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return this.prismaClient.role.findUnique({
      where: { name },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.prismaClient.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async remove(id: string) {
    await this.prismaClient.role.delete({
      where: { id },
    });
  }
}
