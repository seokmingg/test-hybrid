import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Memo } from './memo.entity';
import { MemoService } from './memo.service';
import { MemoController } from './memo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Memo])],
  providers: [MemoService],
  controllers: [MemoController],
})
export class MemoModule {} 