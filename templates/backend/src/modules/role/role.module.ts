import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RoleController } from './role.controller';
import { RoleRepository } from '../../shared/repository/role.repository';
import { RoleService } from './role.service';

@Module({
  imports: [PrismaModule],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService],
})
export class RoleModule {}
