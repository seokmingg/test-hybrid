import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';
import { ModuleRef } from '@nestjs/core'; // ✅ 핵심
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private logger: Logger;

  constructor(
      private readonly authService: AuthService,
      private readonly moduleRef: ModuleRef,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      scope: ['email', 'profile'],
    });

    // ✅ 여기서 수동으로 Logger 인스턴스를 주입받음
    this.logger = this.moduleRef.get(WINSTON_MODULE_NEST_PROVIDER, { strict: false });
  }

  async validate(
      accessToken: string,
      refreshToken: string,
      profile: any,
  ): Promise<User> {
    const { id, emails, displayName } = profile;
    const email = emails[0].value;

    this.logger.info('구글 로그인 요청', {
      googleId: id,
      email,
      displayName,
    });

    let user = await this.authService.validateUser(email);
    if (!user) {
      this.logger.info('신규 사용자 생성', {
        email,
        googleId: id,
      });

      user = await this.authService.createUser({
        email,
        name: displayName,
        googleId: id,
      });

      this.logger.info('신규 사용자 생성 완료', { userId: user.id });
    } else {
      this.logger.info('기존 사용자 로그인', { userId: user.id });
    }

    return user;
  }
}