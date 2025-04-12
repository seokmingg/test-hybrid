import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memo } from './memo.entity';
import { User } from '../auth/entities/user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class MemoService {
  constructor(
      @InjectRepository(Memo)
      private readonly memoRepository: Repository<Memo>,

      @Inject(WINSTON_MODULE_NEST_PROVIDER)
      private readonly logger: Logger,
  ) {}

  async createMemo(content: string, user: User): Promise<Memo> {
    this.logger.info('메모 생성 요청', { userId: user.id, content });

    const memo = this.memoRepository.create({
      content,
      user,
    });

    const saved = await this.memoRepository.save(memo);

    this.logger.info('메모 생성 완료', { memoId: saved.id });
    return saved;
  }

  async getMemos(user: User): Promise<Memo[]> {
    this.logger.info('메모 목록 조회 요청', { userId: user.id });

    const memos = await this.memoRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });

    this.logger.info('메모 목록 조회 완료', { count: memos.length });
    return memos;
  }
}