import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, name: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      user = this.userRepository.create({ email, name })
      await this.userRepository.save(user)
    }

    return user
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async updateDailyChatCount(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!user.lastChatDate || user.lastChatDate < today) {
      user.dailyChatCount = 0
      user.lastChatDate = today
    }

    if (user.dailyChatCount >= 5) return false

    user.dailyChatCount += 1
    await this.userRepository.save(user)
    return true
  }
} 