import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET', 'dev-secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    try {
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Token inválido');
      }
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }

    return payload;
  }
}
