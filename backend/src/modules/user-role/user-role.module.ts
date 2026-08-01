import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { UserRoleController } from './user-role.controller';
import { UserRoleRepository } from './user-role.repository';
import { UserRoleService } from './user-role.service';

@Module({
  imports: [PrismaModule, UserModule, RoleModule],
  controllers: [UserRoleController],
  providers: [UserRoleService, UserRoleRepository],
  exports: [UserRoleRepository], // Export repository for AuthService
})
export class UserRoleModule {}
