import { Controller, Post, Body, Req } from '@nestjs/common'
import { ChatService } from './chat.service'

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async chat(@Req() req, @Body('message') message: string) {
    const ip = req.ip
    const response = await this.chatService.generateResponse(ip, message)
    return { response }
  }
} 