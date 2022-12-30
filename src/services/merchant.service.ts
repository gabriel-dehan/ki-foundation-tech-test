import { Cashback } from 'src/entities/cashback.model';
import { Merchant } from 'src/entities/merchant.model';
import { Transaction, TransactionType } from 'src/entities/transaction.model';
import { User } from 'src/entities/user.model';
import { DateRangeInput, SortInput } from 'src/types/input.types';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';

@Service()
export class MerchantService {
  constructor(
    @Inject('Cashback')
    private cashbackRepository: Repository<Cashback>,
    @Inject('Merchant')
    private merchantRepository: Repository<Merchant>,
  ) {}

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

  async getActiveMerchants(input: DateRangeInput) {
    const { startDate, endDate } = input;

    return await this.merchantRepository
      .createQueryBuilder('merchant')
      .where((query) => {
        // A bit of a pain with the merchant_id being in the metadata
        const subQuery = query
          .subQuery()
          .from(Transaction, 'transaction')
          .select(
            `DISTINCT(transaction.metadata -> 'card' -> 'merchant' ->> 'id')::uuid`,
            'merchant_id',
          )
          .innerJoin('transaction.bankAccount', 'bankAccount')
          .innerJoin('bankAccount.user', 'user')
          .where(
            `transaction.metadata -> 'card' -> 'merchant' ->> 'id' IS NOT NULL`,
          )
          .andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
          })
          .andWhere(`transaction.type != :type`, {
            type: TransactionType.REFUND,
          })
          .groupBy('merchant_id')
          .having('count(distinct user.id) >= 2');

        return `merchant.id IN ${subQuery.getQuery()}`;
      })
      .getMany();
  }
}
