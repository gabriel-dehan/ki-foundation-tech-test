import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
} from 'routing-controllers';
import { User, UserRole } from 'src/entities/user.model';
import { CashbackService } from 'src/services/cashback.service';
import { SortInput } from 'src/types/input.types';
import { Service } from 'typedi';

@JsonController('/cashbacks')
@Authorized()
@Service()
export class CashbacksController {
  constructor(private cashbackService: CashbackService) {}

  @Get('/')
  async index(@CurrentUser() user: User, @Body() input: SortInput) {
    return await this.cashbackService.getUserCashbacks(user.id, input);
  }

  @Get('/cashback-per-merchant')
  @Authorized(UserRole.ADMIN)
  async getCashbackTotalPerMerchant() {
    return await this.cashbackService.getCashbackTotalPerMerchant();
  }
}
