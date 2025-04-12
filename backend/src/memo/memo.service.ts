import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memo } from './memo.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class MemoService {
  private readonly logger = new Logger(MemoService.name); // ✅ Nest Logger 선언

  constructor(
      @InjectRepository(Memo)
      private readonly memoRepository: Repository<Memo>,
  ) {}

  async createMemo(content: string, user: User): Promise<Memo> {
    this.logger.log(`메모 생성 요청 - userId: ${user.id}, content: ${content}`);

    const memo = this.memoRepository.create({
      content,
      user,
    });

    const saved = await this.memoRepository.save(memo);

    this.logger.log(`메모 생성 완료 - memoId: ${saved.id}`);
    return saved;
  }

  async getMemos(user: User): Promise<Memo[]> {
    this.logger.log(`메모 목록 조회 요청 - userId: ${user.id}`);

    const memos = await this.memoRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });

    this.logger.log(`메모 목록 조회 완료 - ${memos.length}건`);
    return memos;
  }
}