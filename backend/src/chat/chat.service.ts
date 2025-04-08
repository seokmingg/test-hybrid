import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OpenAIApi, Configuration } from 'openai'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class ChatService {
  private openai: OpenAIApi

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const configuration = new Configuration({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    })
    this.openai = new OpenAIApi(configuration)
  }

  async generateResponse(userId: string, message: string): Promise<string> {
    const canChat = await this.authService.updateDailyChatCount(userId)
    if (!canChat) {
      throw new Error('일일 채팅 횟수를 초과했습니다.')
    }

    try {
      const completion = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      })

      return completion.data.choices[0].message.content
    } catch (error) {
      throw new Error('ChatGPT API 호출 중 오류가 발생했습니다.')
    }
  }
} 