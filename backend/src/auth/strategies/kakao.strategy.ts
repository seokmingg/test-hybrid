import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
      private readonly authService: AuthService,
      @Inject(WINSTON_MODULE_NEST_PROVIDER)
      private readonly logger: Logger,
  ) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/kakao/callback`,
    });
  }

  async validate(
      accessToken: string,
      refreshToken: string,
      profile: any,
  ): Promise<User> {
    const { id, _json } = profile;
    const email = _json.kakao_account.email;
    const nickname = _json.properties.nickname;

    this.logger.info('카카오 로그인 요청', {
      kakaoId: id,
      email,
      nickname,
    });

    let user = await this.authService.validateUser(email);

    if (!user) {
      this.logger.info('신규 사용자, 계정 생성 중', {
        email,
        kakaoId: id,
      });

      user = await this.authService.createUser({
        email,
        name: nickname,
        kakaoId: id,
      });

      this.logger.info('신규 사용자 생성 완료', { userId: user.id });
    } else {
      this.logger.info('기존 사용자 로그인', { userId: user.id });
    }

    return user;
  }
}