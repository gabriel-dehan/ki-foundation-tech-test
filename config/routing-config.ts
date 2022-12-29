import * as controllers from 'src/controllers';
import * as middlewares from 'config/routing-middlewares';
import { RoutingControllersOptions, Action } from 'routing-controllers';
import { getEnumValues } from 'src/utils/getEnumValues';

export const routingConfigs: RoutingControllersOptions = {
  controllers: getEnumValues(controllers),
  middlewares: getEnumValues(middlewares),
  interceptors: [],
  routePrefix: '/api',
  // TODO: Should probably use DTO files for validations
  validation: true,
  authorizationChecker: async (action: Action, roles: string[]) => {
    // TODO: Authorization with roles
    return !!action.context.state.user;
  },
  // TODO: Retrieve user and check that it exists to set @CurrentUser and check authorization
  // currentUserChecker: async (action: Action) => {
  //   return database.getManager().findOneByToken(User, token);
  // },
};
