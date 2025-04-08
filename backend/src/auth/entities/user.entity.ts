import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  email: string

  @Column()
  name: string

  @Column({ nullable: true })
  googleId: string

  @Column({ nullable: true })
  kakaoId: string

  @Column({ default: 0 })
  dailyChatCount: number

  @Column({ type: 'timestamp', nullable: true })
  lastChatDate: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
} 