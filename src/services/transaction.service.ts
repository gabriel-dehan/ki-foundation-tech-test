import { Transaction } from 'src/entities/transaction.model';
import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import { WebhookTransactionInterface } from 'src/types/transaction.types';

@Service()
export class TransactionService {
  constructor(
    @Inject('Transaction')
    private transactionRepository: Repository<Transaction>,
  ) {}

  // TODO: Using DTOs would be cleaner but so much boilerplate
  async createFromWebhook(
    input: WebhookTransactionInterface,
  ): Promise<{ transaction: Transaction }> {
    const transaction = new Transaction({});

    await this.transactionRepository.save(transaction);

    return { transaction };
  }
}
