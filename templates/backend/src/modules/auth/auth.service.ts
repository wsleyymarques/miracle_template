import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MAIL_SERVICE } from '../../common/mail/mail.service';
import type { MailService } from '../../common/mail/mail.service';
import { UserMapper } from '../user/user.mapper';
import { UserService } from '../user/user.service';
import { UserRoleRepository } from '../user-role/user-role.repository';

function addMinutes(date: Date, minutes: number): Date {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);
  return next;
}
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { PasswordResetCodeRepository } from './password-reset-code.repository';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class AuthService {
  private static readonly FIXED_CODE_ALLOWED_ENVS = ['development', 'test'];

  constructor(
    private readonly userService: UserService,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly passwordResetCodeRepository: PasswordResetCodeRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(MAIL_SERVICE) private readonly mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmailWithPassword(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const userRoles = await this.userRoleRepository.findRolesByUserId(user.id);
    const roles = userRoles.map((ur) => ur.role.name);

    const accessToken = await this.generateAccessToken(
      user.id,
      user.email,
      roles,
    );
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken: refreshToken.token,
      usuario: UserMapper.toEntity(user),
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const tokenHash = this.hashToken(refreshTokenDto.refreshToken);
    const rt = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!rt || new Date() > rt.expiresAt) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    const user = await this.userService.findById(rt.userId);
    if (!user) {
      await this.refreshTokenRepository.delete(rt.id);
      throw new UnauthorizedException('Usuário não encontrado');
    }

    await this.refreshTokenRepository.delete(rt.id);

    const userRoles = await this.userRoleRepository.findRolesByUserId(user.id);
    const roles = userRoles.map((ur) => ur.role.name);

    const newAccessToken = await this.generateAccessToken(
      user.id,
      user.email,
      roles,
    );
    const newRefreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
    };
  }

  async logout(userId: string) {
    await this.refreshTokenRepository.deleteAllByUserId(userId);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(forgotPasswordDto.email);

    if (user) {
      await this.passwordResetCodeRepository.deleteAllByUserId(user.id);

      const code = this.generateResetCode();
      const codeHash = await bcrypt.hash(code, 10);
      const expiresAt = addMinutes(
        new Date(),
        this.configService.get<number>('RESET_CODE_EXPIRES_IN_MINUTES', 15),
      );

      await this.passwordResetCodeRepository.create(
        codeHash,
        user.id,
        expiresAt,
      );
      await this.mailService.sendPasswordResetCode(user.email, code);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findByEmail(resetPasswordDto.email);
    if (!user) {
      throw new BadRequestException('Código inválido ou expirado');
    }

    const resetCode = await this.passwordResetCodeRepository.findLatestByUserId(
      user.id,
    );
    const maxAttempts = this.configService.get<number>(
      'RESET_CODE_MAX_ATTEMPTS',
      5,
    );

    if (
      !resetCode ||
      new Date() > resetCode.expiresAt ||
      resetCode.attempts >= maxAttempts
    ) {
      throw new BadRequestException('Código inválido ou expirado');
    }

    const isCodeMatching = await bcrypt.compare(
      resetPasswordDto.code,
      resetCode.codeHash,
    );

    if (!isCodeMatching) {
      await this.passwordResetCodeRepository.incrementAttempts(resetCode.id);
      throw new BadRequestException('Código inválido ou expirado');
    }

    await this.userService.forceSetPassword(
      user.id,
      resetPasswordDto.newPassword,
    );

    await this.passwordResetCodeRepository.delete(resetCode.id);
    await this.refreshTokenRepository.deleteAllByUserId(user.id);
  }

  private async generateAccessToken(
    userId: string,
    email: string,
    roles: string[],
  ): Promise<string> {
    const payload: JwtPayload = { sub: userId, email, roles };
    return this.jwtService.signAsync(payload as never, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET', 'dev-secret'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m') as never,
    });
  }

  private async generateRefreshToken(
    userId: string,
  ): Promise<{ token: string; hash: string }> {
    const token = crypto.randomBytes(48).toString('hex');
    const hash = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN_DAYS', 7));

    await this.refreshTokenRepository.create(hash, userId, expiresAt);
    return { token, hash };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateResetCode(): string {
    const fixedEnabled =
      this.configService.get('AUTH_FIXED_RESET_CODE_ENABLED') === 'true';
    const currentEnv = this.configService.get<string>('NODE_ENV');
    const envAllowsFixedCode = currentEnv
      ? AuthService.FIXED_CODE_ALLOWED_ENVS.includes(currentEnv)
      : false;

    if (fixedEnabled && envAllowsFixedCode) {
      return this.configService.get<string>('AUTH_FIXED_RESET_CODE', '123456');
    }

    return crypto.randomInt(100000, 999999).toString();
  }
}
