import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MemoService } from './memo.service';
import { User } from '../auth/entities/user.entity';

@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createMemo(@Body('content') content: string, @Req() req: { user: User }) {
    return this.memoService.createMemo(content, req.user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getMemos(@Req() req: { user: User }) {
    return this.memoService.getMemos(req.user);
  }
} 