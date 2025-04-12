import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name); // ✅ Nest Logger

  constructor(
      @InjectRepository(User)
      public readonly userRepository: Repository<User>,
      private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<User | null> {
    this.logger.log(`유저 조회 시도 - ${email}`);
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      this.logger.log(`유저 조회 성공 - userId: ${user.id}`);
    } else {
      this.logger.warn(`유저 조회 실패 - 없음: ${email}`);
    }

    return user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    this.logger.log(`회원가입 시도 - email: ${userData.email}`);
    const user = this.userRepository.create(userData);
    const saved = await this.userRepository.save(user);
    this.logger.log(`회원가입 성공 - userId: ${saved.id}`);
    return saved;
  }

  async login(user: User) {
    this.logger.log(`로그인 시도 - userId: ${user.id}, email: ${user.email}`);
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    this.logger.log(`JWT 발급 완료 - userId: ${user.id}`);
    return token;
  }
}