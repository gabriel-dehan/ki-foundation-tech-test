import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from 'src/entities/base.model';
import { BankAccount } from 'src/entities/bank-account.model';
import { IsEmail } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User extends Base {
  // TODO: Is this necessary?
  // constructor(input?: ModelPartial<User>) {
  //   super(input);
  // }

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => BankAccount, (target) => target.user)
  bankAccounts: BankAccount[];
}
