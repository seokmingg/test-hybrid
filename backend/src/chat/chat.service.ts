import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'

@Injectable()
export class ChatService {
  private readonly MAX_CHAT_COUNT = 5

  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async generateResponse(ip: string, message: string): Promise<string> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]
    const key = `chat:${ip}:${todayStr}`

    // Get current chat count from Redis
    const currentCount = parseInt(await this.redis.get(key) || '0')

    if (currentCount >= this.MAX_CHAT_COUNT) {
      return '죄송합니다. 일일 무료 채팅 횟수(5회)를 모두 사용하셨습니다.'
    }

    // Increment chat count
    await this.redis.incr(key)
    // Set expiration to end of day
    const secondsUntilEndOfDay = 24 * 60 * 60 - (Date.now() - today.getTime()) / 1000
    await this.redis.expire(key, Math.floor(secondsUntilEndOfDay))

    // 간단한 응답 생성
    const responses = [
      '안녕하세요! 어떻게 도와드릴까요?',
      '좋은 질문이에요!',
      '더 자세히 설명해주시겠어요?',
      '그 점에 대해 생각해보겠습니다.',
      '흥미로운 주제네요!'
    ]

    const randomIndex = Math.floor(Math.random() * responses.length)
    return responses[randomIndex]
  }
} 