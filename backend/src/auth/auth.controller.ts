import { Controller, Get, UseGuards, Req, Res, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name); // ✅ Nest Logger

  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Google OAuth 시작
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const token = await this.authService.login(user);

    this.logger.log(`구글 로그인 완료 - userId: ${user.id}`); // ✅ Nest Logger 사용

    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth() {
    // Kakao OAuth 시작
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const token = await this.authService.login(user);

    this.logger.log(`카카오 로그인 완료 - userId: ${user.id}`); // ✅ Nest Logger 사용

    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('logout')
  logout(@Res() res: Response) {
    this.logger.log('사용자 로그아웃 처리');
    res.redirect(process.env.FRONTEND_URL);
  }
}