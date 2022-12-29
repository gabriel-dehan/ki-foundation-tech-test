import {
  Authorized,
  CurrentUser,
  Get,
  JsonController,
} from 'routing-controllers';
import { User, UserRole } from 'src/entities/user.model';
// import { Service } from 'typedi';

@JsonController('/users')
@Authorized()
// @Service()
export class UsersController {
  // constructor(private usersService: UsersService) {}

  @Get()
  async index(@CurrentUser() user?: User /*, @Body() question: Question*/) {
    console.log(user);
    return [];
  }
}
