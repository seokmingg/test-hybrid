import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
      private readonly authService: AuthService,
      @Inject(WINSTON_MODULE_NEST_PROVIDER)
      private readonly _logger: Logger, // 🔐 안전하게 이름 변경
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
      accessToken: string,
      refreshToken: string,
      profile: any,
  ): Promise<User> {
    const { id, emails, displayName } = profile;
    const email = emails[0].value;

    this._logger.info('구글 로그인 요청', {
      googleId: id,
      email,
      displayName,
    });

    let user = await this.authService.validateUser(email);

    if (!user) {
      this._logger.info('신규 사용자, 계정 생성 중', {
        email,
        googleId: id,
      });

      user = await this.authService.createUser({
        email,
        name: displayName,
        googleId: id,
      });

      this._logger.info('신규 사용자 생성 완료', { userId: user.id });
    } else {
      this._logger.info('기존 사용자 로그인', { userId: user.id });
    }

    return user;
  }
}