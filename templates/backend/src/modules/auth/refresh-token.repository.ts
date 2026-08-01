import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get prismaClient(): any {
    return this.prisma as any;
  }

  async create(tokenHash: string, userId: string, expiresAt: Date) {
    return this.prismaClient.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    });
  }

  async findByTokenHash(tokenHash: string) {
    return this.prismaClient.refreshToken.findUnique({
      where: { tokenHash },
    });
  }

  async delete(id: string) {
    return this.prismaClient.refreshToken.delete({
      where: { id },
    });
  }

  async deleteAllByUserId(userId: string) {
    return this.prismaClient.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
