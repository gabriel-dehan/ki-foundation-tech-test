import { Authorized, Get, JsonController } from 'routing-controllers';
// import { Service } from 'typedi';

@JsonController('/users')
@Authorized()
// @Service()
export class UsersController {
  // constructor(private usersService: UsersService) {}

  // TODO: Use UserService to retrieve data
  @Get()
  async index() {
    return [];
  }
}
