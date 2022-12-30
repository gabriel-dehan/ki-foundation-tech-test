import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { Base } from 'src/entities/base.model';
import { BankAccount } from 'src/entities/bank-account.model';
import {
  TransactionCardMetadata,
  TransactionTransferMetadata,
} from 'src/types/transaction.types';
import { ModelPartial } from 'src/utils/modelPartial';

export enum TransactionType {
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
  REFUND = 'REFUND',
}

type TransactionMetadata = {
  card?: TransactionCardMetadata;
  transfer?: TransactionTransferMetadata;
};

export enum TransactionStatus {
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  FAILED = 'FAILED',
}

@Entity()
export class Transaction extends Base {
  constructor(input?: ModelPartial<Transaction>) {
    super(input);
  }

  @RelationId((self: Transaction) => self.bankAccount)
  readonly bankAccountId: BankAccount['id'];

  @ManyToOne(() => BankAccount, (target) => target.transactions, {
    nullable: false,
  })
  bankAccount: BankAccount;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  // Amount before cashback
  @Column({ type: 'integer' })
  initialAmount: number;

  // Amount after cashback
  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'jsonb', default: '{}' })
  metadata?: TransactionMetadata;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  // Note: We don't add a cashback relation here because a transaction should remain agnostic as much as possible
}
