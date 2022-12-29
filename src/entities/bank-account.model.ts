import { Entity, Column, ManyToOne, RelationId, OneToMany } from 'typeorm';
import { Base } from 'src/entities/base.model';
import { User } from 'src/entities/user.model';
import { Transaction } from 'src/entities/transaction.model';

@Entity()
export class BankAccount extends Base {
  @RelationId((self: BankAccount) => self.user)
  readonly userId: User['id'];

  @ManyToOne(() => User, (target) => target.bankAccounts, {
    nullable: false,
  })
  user: User;

  // TODO: Add validation to have either
  @Column({ nullable: true, unique: true })
  IBAN?: string;

  @Column({ nullable: true, unique: true })
  BIC?: string;

  @OneToMany(() => Transaction, (target) => target.bankAccount)
  transactions: Transaction[];
}
