import { Entity, Column, ManyToOne, RelationId, OneToMany } from 'typeorm';
import { Base } from 'src/entities/base.model';
import { User } from 'src/entities/user.model';
import { Transaction } from 'src/entities/transaction.model';
import { ModelPartial } from 'src/utils/modelPartial';

@Entity()
export class BankAccount extends Base {
  constructor(input?: ModelPartial<BankAccount>) {
    super(input);
  }

  @RelationId((self: BankAccount) => self.user)
  readonly userId: User['id'];

  @ManyToOne(() => User, (target) => target.bankAccounts, {
    nullable: false,
  })
  user: User;

  // When receiving money from the webhook we need to be able to identify the bank account, often through the cardId
  @Column({ nullable: true, unique: true })
  cardId?: string;

  // TODO: Add validation to have either
  @Column({ nullable: true, unique: true })
  IBAN?: string;

  @Column({ nullable: true, unique: true })
  BIC?: string;

  @OneToMany(() => Transaction, (target) => target.bankAccount)
  transactions: Transaction[];
}
