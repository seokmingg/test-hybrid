import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memo } from './memo.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class MemoService {
  constructor(
    @InjectRepository(Memo)
    private readonly memoRepository: Repository<Memo>,
  ) {}

  async createMemo(content: string, user: User): Promise<Memo> {
    const memo = this.memoRepository.create({
      content,
      user,
    });
    return this.memoRepository.save(memo);
  }

  async getMemos(user: User): Promise<Memo[]> {
    return this.memoRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }
} 