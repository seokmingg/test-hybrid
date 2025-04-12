import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  private readonly logger = new Logger(KakaoStrategy.name); // ✅ Nest Logger

  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/kakao/callback`,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<User> {
    const { id, _json } = profile;
    const email = _json.kakao_account.email;
    const nickname = _json.properties.nickname;

    this.logger.log(`카카오 로그인 요청 - email: ${email}, kakaoId: ${id}`);

    let user = await this.authService.validateUser(email);
    if (!user) {
      this.logger.log(`신규 사용자 생성 - email: ${email}`);
      user = await this.authService.createUser({
        email,
        name: nickname,
        kakaoId: id,
      });
      this.logger.log(`신규 사용자 생성 완료 - userId: ${user.id}`);
    } else {
      this.logger.log(`기존 사용자 로그인 - userId: ${user.id}`);
    }

    return user;
  }
}