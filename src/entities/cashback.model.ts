import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { Base } from 'src/entities/base.model';
import { Transaction } from 'src/entities/transaction.model';
import { Merchant } from 'src/entities/merchant.model';
import { ModelPartial } from 'src/utils/modelPartial';

// TODO: This is pretty much the same thing as the transaction's atm, should we remove it?
// It makes more sense on the transaction side but in the future both could differ
enum CashbackStatus {
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  FAILED = 'FAILED',
}

@Entity()
export class Cashback extends Base {
  constructor(input?: ModelPartial<Cashback>) {
    super(input);
  }

  @RelationId((self: Cashback) => self.transaction)
  readonly transactionId: Transaction['id'];

  @ManyToOne(() => Transaction, {
    nullable: false,
  })
  transaction: Transaction;

  @RelationId((self: Cashback) => self.merchant)
  readonly merchantId: Merchant['id'];

  @ManyToOne(() => Merchant, (target) => target.cashbacks, {
    nullable: false,
  })
  merchant: Merchant;

  @Column({
    type: 'enum',
    enum: CashbackStatus,
    default: CashbackStatus.PENDING,
  })
  status: CashbackStatus;
}
