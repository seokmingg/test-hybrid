import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AuthService {
  constructor(
      @InjectRepository(User)
      public readonly userRepository: Repository<User>,
      private readonly jwtService: JwtService,

      @Inject(WINSTON_MODULE_NEST_PROVIDER)
      private readonly logger: Logger,
  ) {}

  async validateUser(email: string): Promise<User | null> {
    this.logger.info('유저 조회 시도', { email });
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      this.logger.info('유저 조회 성공', { userId: user.id });
    } else {
      this.logger.warn('유저 조회 실패 - 없음', { email });
    }

    return user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    this.logger.info('회원가입 시도', { email: userData.email, provider: userData.name });
    const user = this.userRepository.create(userData);
    const saved = await this.userRepository.save(user);
    this.logger.info('회원가입 성공', { userId: saved.id });
    return saved;
  }

  async login(user: User) {
    this.logger.info('로그인 시도', { userId: user.id, email: user.email });
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    this.logger.info('JWT 발급 완료', { userId: user.id });
    return token;
  }
}