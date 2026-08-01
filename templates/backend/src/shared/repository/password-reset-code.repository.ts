import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IPasswordResetCodeRepository } from './interfaces/repository.interface';

@Injectable()
export class PasswordResetCodeRepository implements IPasswordResetCodeRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get prismaClient(): any {
    return this.prisma as any;
  }

  async create(codeHash: string, userId: string, expiresAt: Date) {
    return this.prismaClient.passwordResetCode.create({
      data: {
        codeHash,
        userId,
        expiresAt,
      },
    });
  }

  async findLatestByUserId(userId: string) {
    return this.prismaClient.passwordResetCode.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async incrementAttempts(id: string) {
    return this.prismaClient.passwordResetCode.update({
      where: { id },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });
  }

  async delete(id: string) {
    return this.prismaClient.passwordResetCode.delete({
      where: { id },
    });
  }

  async deleteAllByUserId(userId: string) {
    return this.prismaClient.passwordResetCode.deleteMany({
      where: { userId },
    });
  }
}
