import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { Base } from 'src/entities/base.model';
import { User } from 'src/entities/user.model';
import { BankAccount } from 'src/entities/bank-account.model';

enum TransactionType {
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
  REFUND = 'REFUND',
}

type CardMetadata = {
  card_id: string;
  merchant: {
    id: string;
    category_code: string;
    country_code: string;
    name: string;
  };
};

type TransferMetadata = {
  sender: {
    name: string;
  };
};

type TransactionMetadata = {
  card?: CardMetadata;
  transfer?: TransferMetadata;
};

enum TransactionStatus {
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  FAILED = 'FAILED',
}

@Entity()
export class Transaction extends Base {
  @RelationId((self: Transaction) => self.bankAccount)
  readonly bankAccountId: BankAccount['id'];

  @ManyToOne(() => User, (target) => target.bankAccounts, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  bankAccount: BankAccount;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

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
}
