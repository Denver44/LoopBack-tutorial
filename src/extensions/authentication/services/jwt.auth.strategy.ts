import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {UserServiceBindings} from '../keys';
import {AuthCredentials, StrategyService} from './strategy.service';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'jwt-auth-strategy';

  constructor(
    @inject(UserServiceBindings.STRATEGY_SERVICE)
    public strategyService: StrategyService,
  ) {}

  async authenticate(
    request: Request,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<UserProfile | AuthCredentials | undefined | any> {
    return this.strategyService.performJWTStrategy(request);
  }
}
