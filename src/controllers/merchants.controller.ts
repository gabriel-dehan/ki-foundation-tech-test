import { Authorized, Body, Get, JsonController } from 'routing-controllers';
import { UserRole } from 'src/entities/user.model';
import { MerchantService } from 'src/services/merchant.service';
import { DateRangeInput, SortInput } from 'src/types/input.types';
import { Service } from 'typedi';

@JsonController('/merchants')
@Authorized()
@Service()
export class MerchantsController {
  constructor(private merchantService: MerchantService) {}

  @Get('/cashback-per-merchant')
  @Authorized(UserRole.ADMIN)
  async getCashbackTotalPerMerchant() {
    return await this.merchantService.getCashbackTotalPerMerchant();
  }

  // TODO: Handle date normalization from params in a better way
  @Get('/active')
  @Authorized(UserRole.ADMIN)
  async getActiveMerchants(@Body() input: DateRangeInput) {
    return await this.merchantService.getActiveMerchants({
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
    });
  }
}
