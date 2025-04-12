import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name); // 💡 context 자동 지정됨

  constructor(private readonly authService: AuthService) {
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

    this.logger.log(`구글 로그인 요청 - ${email}`);

    let user = await this.authService.validateUser(email);
    if (!user) {
      this.logger.log(`신규 사용자 생성 - ${email}`);
      user = await this.authService.createUser({
        email,
        name: displayName,
        googleId: id,
      });
      this.logger.log(`신규 사용자 생성 완료 - ${user.id}`);
    } else {
      this.logger.log(`기존 사용자 로그인 - ${user.id}`);
    }

    return user;
  }
}