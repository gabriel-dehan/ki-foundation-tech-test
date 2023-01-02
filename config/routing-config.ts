import * as controllers from 'src/controllers';
import * as middlewares from 'config/routing-middlewares';
import { RoutingControllersOptions, Action } from 'routing-controllers';
import { getEnumValues } from 'src/utils/getEnumValues';
import datasource from 'config/data-source';
import { User } from 'src/entities/user.model';

export const routingConfigs: RoutingControllersOptions = {
  controllers: getEnumValues(controllers),
  middlewares: getEnumValues(middlewares),
  interceptors: [],
  routePrefix: '/api',
  validation: true,
  authorizationChecker: async (action: Action, roles: string[]) => {
    if (action.context.state?.user?.sub) {
      const user = await datasource
        .getRepository(User)
        .findOne({ where: { id: action.context.state.user.sub } });

      if (!user) {
        return false;
      }

      return roles.includes(user.role);
    } else {
      return false;
    }
  },
  currentUserChecker: async (action: Action) => {
    return await datasource
      .getRepository(User)
      .findOne({ where: { id: action.context.state.user.sub } });
  },
};
