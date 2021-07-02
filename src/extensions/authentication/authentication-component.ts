import {registerAuthenticationStrategy} from '@loopback/authentication';
import {
  Application,
  Binding,
  Component,
  CoreBindings,
  createBindingFromClass,
  inject
} from '@loopback/core';
import {
  PermissionServiceBindings,
  RefreshTokenConstants,
  RefreshTokenServiceBindings,
  RoleServiceBindings,
  SessionServiceBindings,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings
} from './keys';
import {
  PermissionRepository,
  RefreshTokenRepository,
  RoleRepository,
  SessionRepository,
  UserCredentialsRepository,
  UserRepository
} from './repositories';
import {
  JWTAuthenticationStrategy,
  RefreshtokenService,
  StrategyService,
  UserService
} from './services';
import {JWTService} from './services/jwt.service';
import {SecuritySpecEnhancer} from './services/security.spec.enhancer';

export class DsmAuthenticationComponent implements Component {
  bindings: Binding[] = [
    // token bindings
    Binding.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    ),
    Binding.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    ),
    Binding.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService),

    // user bindings
    Binding.bind(UserServiceBindings.USER_SERVICE).toClass(UserService),
    Binding.bind(UserServiceBindings.STRATEGY_SERVICE).toClass(StrategyService),
    Binding.bind(UserServiceBindings.USER_REPOSITORY).toClass(UserRepository),
    Binding.bind(UserServiceBindings.USER_CREDENTIALS_REPOSITORY).toClass(
      UserCredentialsRepository,
    ),

  
    createBindingFromClass(SecuritySpecEnhancer),
    ///refresh bindings
    Binding.bind(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE).toClass(
      RefreshtokenService,
    ),

    // Session bindings
    Binding.bind(SessionServiceBindings.SESSION_REPOSITORY).toClass(
      SessionRepository,
    ),

 
    //permission
    Binding.bind(PermissionServiceBindings.PERMISSION_REPOSITORY).toClass(
      PermissionRepository,
    ),

    //roles
    Binding.bind(RoleServiceBindings.ROLE_REPOSITORY).toClass(RoleRepository),

    //  Refresh token bindings
    Binding.bind(RefreshTokenServiceBindings.REFRESH_SECRET).to(
      RefreshTokenConstants.REFRESH_SECRET_VALUE,
    ),
    Binding.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to(
      RefreshTokenConstants.REFRESH_EXPIRES_IN_VALUE,
    ),
    Binding.bind(RefreshTokenServiceBindings.REFRESH_ISSUER).to(
      RefreshTokenConstants.REFRESH_ISSUER_VALUE,
    ),
    //refresh token repository binding
    Binding.bind(RefreshTokenServiceBindings.REFRESH_REPOSITORY).toClass(
      RefreshTokenRepository,
    ),
  ];
  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) app: Application) {
    registerAuthenticationStrategy(app, JWTAuthenticationStrategy);

  }
}
