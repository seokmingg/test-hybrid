import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { User } from './entities/user.entity'
import { GoogleStrategy } from './strategies/google.strategy'
import { KakaoStrategy } from './strategies/kakao.strategy'

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, KakaoStrategy],
  exports: [AuthService],
})
export class AuthModule {} 