import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      private configService: ConfigService,
      private authService: AuthService,

      @Inject(WINSTON_MODULE_NEST_PROVIDER)
      private readonly logger: Logger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    this.logger.info('JWT 검증 시도', {
      email: payload.email,
      userId: payload.sub,
    });

    const user = await this.authService.validateUser(payload.email);

    if (!user) {
      this.logger.warn('JWT 사용자 없음', {
        email: payload.email,
      });
      throw new UnauthorizedException('User not found');
    }

    this.logger.info('JWT 검증 성공', { userId: user.id });
    return user;
  }
}