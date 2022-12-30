import { Cashback } from 'src/entities/cashback.model';
import { User } from 'src/entities/user.model';
import { SortInput } from 'src/types/input.types';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';

@Service()
export class CashbackService {
  constructor(
    @Inject('Cashback')
    private cashbackRepository: Repository<Cashback>,
  ) {}

  async getUserCashbacks(userId: User['id'], input: SortInput) {
    const { sort } = input;

    return await this.cashbackRepository
      .createQueryBuilder('cashback')
      .innerJoinAndSelect('cashback.transaction', 'transaction')
      .innerJoin('transaction.bankAccount', 'bankAccount')
      .innerJoin('bankAccount.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy(`cashback.createdAt`, sort || 'DESC')
      .getMany();
  }

  async getCashbackTotalPerMerchant() {
    return await this.cashbackRepository
      .createQueryBuilder('cashback')
      .innerJoin('cashback.merchant', 'merchant')
      // .where('cashback.status = :status', { status: 'FULFILLED' })
      .groupBy('merchant.id')
      .select('merchant.id', 'id')
      .addSelect('merchant.name', 'name')
      .addSelect('SUM(cashback.refundedAmount)', 'totalCashbackAmount')
      .getRawMany();
  }
}
