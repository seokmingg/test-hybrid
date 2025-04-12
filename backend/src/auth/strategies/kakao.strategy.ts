import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ModuleRef } from '@nestjs/core'; // 💡 핵심!

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  private logger: Logger;

  constructor(
      private readonly authService: AuthService,
      private readonly moduleRef: ModuleRef, // 💡 직접 참조
  ) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/kakao/callback`,
    });

    // 이 시점에서 직접 가져옴
    this.logger = this.moduleRef.get(WINSTON_MODULE_NEST_PROVIDER, { strict: false });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<User> {
    const { id, _json } = profile;
    const email = _json.kakao_account.email;
    const nickname = _json.properties.nickname;

    this.logger.info('카카오 로그인 요청', { kakaoId: id, email, nickname });

    let user = await this.authService.validateUser(email);
    if (!user) {
      this.logger.info('신규 사용자 생성', { email });
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