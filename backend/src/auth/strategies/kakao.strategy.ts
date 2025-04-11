import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
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

    let user = await this.authService.validateUser(email);
    if (!user) {
      user = await this.authService.createUser({
        email,
        name: nickname,
        kakaoId: id,
      });
    }

    return user;
  }
} 