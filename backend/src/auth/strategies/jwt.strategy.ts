import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name); // ✅ Nest Logger 선언

  constructor(
      private configService: ConfigService,
      private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    this.logger.log(`JWT 검증 시도 - email: ${payload.email}, userId: ${payload.sub}`);

    const user = await this.authService.validateUser(payload.email);

    if (!user) {
      this.logger.warn(`JWT 사용자 없음 - email: ${payload.email}`);
      throw new UnauthorizedException('User not found');
    }

    this.logger.log(`JWT 검증 성공 - userId: ${user.id}`);
    return user;
  }
}