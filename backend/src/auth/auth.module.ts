import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { GoogleStrategy } from './strategies/google.strategy'
import { KakaoStrategy } from './strategies/kakao.strategy'
import { User } from './entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, KakaoStrategy],
  exports: [AuthService],
})
export class AuthModule {} 