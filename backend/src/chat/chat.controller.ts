import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { ChatService } from './chat.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async chat(@Req() req, @Body('message') message: string) {
    const response = await this.chatService.generateResponse(req.user.sub, message)
    return { response }
  }
} 