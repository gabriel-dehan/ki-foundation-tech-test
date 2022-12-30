import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from 'src/entities/transaction.model';
import { Inject, Service } from 'typedi';
import { EntityManager, Repository } from 'typeorm';
import { WebhookTransactionInterface } from 'src/types/transaction.types';
import { BankAccount } from 'src/entities/bank-account.model';
import { BadRequestError } from 'src/errors/BadRequest.error';
import { Merchant } from 'src/entities/merchant.model';
import { Cashback, CashbackStatus } from 'src/entities/cashback.model';

@Service()
export class TransactionService {
  constructor(
    @Inject('Manager')
    private manager: EntityManager,
    @Inject('Transaction')
    private transactionRepository: Repository<Transaction>,
    @Inject('BankAccount')
    private bankAccountRepository: Repository<BankAccount>,
    @Inject('Merchant')
    private merchantRepository: Repository<Merchant>,
    @Inject('Cashback')
    private cashbackRepository: Repository<Cashback>,
  ) {}

  // TODO: Using DTOs would be cleaner but so much boilerplate
  async createFromWebhook(
    input: WebhookTransactionInterface,
  ): Promise<{ transaction: Transaction }> {
    let bankAccount: BankAccount | null;
    let merchant: Merchant | null = null;
    let cashback: Cashback | null = null;
    let transactionType: TransactionType;

    // We check the metadata to know if it's a transfer or a card transaction
    if ('card_id' in input.meta_info) {
      transactionType = TransactionType.CARD;
      // Get the bank account from the cardId
      bankAccount = await this.bankAccountRepository.findOne({
        where: {
          cardId: input.meta_info.card_id,
        },
      });

      // If it's a card transaction we may also be able to get the merchant
      merchant = await this.merchantRepository.findOne({
        where: {
          id: input.meta_info.merchant.id,
        },
        relations: ['brand'],
      });
    } else {
      transactionType = TransactionType.TRANSFER;
      // Get the bank account from the IBAN or BIC
      const query = input.meta_info.iban
        ? { IBAN: input.meta_info.iban }
        : { BIC: input.meta_info.bic };

      bankAccount = await this.bankAccountRepository.findOne({
        where: query,
      });
    }

    if (!bankAccount) {
      throw new BadRequestError('Bank account not found');
    }

    // If amount is in cents we store it as is (that's what we want)
    // If it's in something else we assume it's in dollars and convert it to cents
    const amount =
      input.amount.unit === 'cents'
        ? input.amount.value
        : input.amount.value * 100;

    const transaction = new Transaction({
      type: transactionType,
      bankAccount,
      description: `${input.type}#${input.id}`,
      // Incorrect but I don't have the necessary informations to do the matchings
      status:
        input.status === 'OPEN'
          ? TransactionStatus.PENDING
          : TransactionStatus.FULFILLED,
      initialAmount: amount,
      amount,
      metadata:
        'card_id' in input.meta_info
          ? { card: input.meta_info }
          : { transfer: input.meta_info },
    });

    if (merchant) {
      const { brand } = merchant;
      const cashbackPct = brand.cashbackAmountPercentage;
      const refundedAmount = Math.round((amount * cashbackPct) / 100);

      cashback = new Cashback({
        transaction,
        merchant,
        refundedAmount,
        status: CashbackStatus.PENDING,
      });

      transaction.amount -= cashback.refundedAmount;
    }

    // Save both in the same transaction
    await this.manager.transaction(async (manager) => {
      await manager.save(transaction);
      if (cashback) await manager.save(cashback);
    });

    return { transaction };
  }
}
