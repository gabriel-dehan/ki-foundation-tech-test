import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
} from 'routing-controllers';
import { User } from 'src/entities/user.model';
import { TransactionService } from 'src/services/transaction.service';
import { SortInput } from 'src/types/input.types';
import { Service } from 'typedi';

@JsonController('/transactions')
@Authorized()
@Service()
export class TransactionsController {
  constructor(private transactionService: TransactionService) {}

  @Get('/')
  async index(@CurrentUser() user: User, @Body() input: SortInput) {
    return await this.transactionService.getUserTransactions(user.id, input);
  }
}
