import * as controllers from 'src/controllers';
import * as middlewares from 'config/routing-middlewares';
import { RoutingControllersOptions, Action } from 'routing-controllers';
import { getEnumValues } from 'src/utils/getEnumValues';
import db from 'config/data-source';
import { User } from 'src/entities/user.model';

export const routingConfigs: RoutingControllersOptions = {
  controllers: getEnumValues(controllers),
  middlewares: getEnumValues(middlewares),
  interceptors: [],
  routePrefix: '/api',
  // TODO: Should probably use DTO files for validations
  validation: true,
  authorizationChecker: async (action: Action, roles: string[]) => {
    // TODO: Authorization with roles.includes?(UserRole.ADMIN), etc...
    return !!action.context.state.user;
  },
  currentUserChecker: async (action: Action) => {
    return await db
      .getRepository(User)
      .findOne({ where: { id: action.context.state.user.sub } });
  },
};
