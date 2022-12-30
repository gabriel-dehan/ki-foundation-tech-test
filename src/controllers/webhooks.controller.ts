import { Authorized, Body, JsonController, Post } from 'routing-controllers';
import { TransactionService } from 'src/services/transaction.service';
import { WebhookTransactionInterface } from 'src/types/transaction.types';

import { Service } from 'typedi';

@JsonController('/webhooks')
@Authorized()
@Service()
export class WebhooksController {
  constructor(private transactionsService: TransactionService) {}

  @Post()
  async handleTransaction(
    @Body() transactionData: WebhookTransactionInterface,
  ) {
    await this.transactionsService.createFromWebhook(transactionData);
  }
}
