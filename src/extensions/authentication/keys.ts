import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {User} from './models';
import {StrategyService} from './services/strategy.service';
import {Credentials} from './services/user.service';
import {RefreshTokenService} from './types';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'myjwts3cr3t';
  export const TOKEN_EXPIRES_IN_VALUE = '21600';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service',
  );
  export const STRATEGY_SERVICE = BindingKey.create<StrategyService>(
    'services.strategy.service',
  );

  export const DATASOURCE_NAME = 'jwtdb';
  export const USER_REPOSITORY = 'repositories.UserRepository';
  export const USER_CREDENTIALS_REPOSITORY =
    'repositories.UserCredentialsRepository';
}


export namespace PermissionServiceBindings {
  export const PERMISSION_REPOSITORY = 'repositories.PermissionRepository';
}

export namespace RoleServiceBindings {
  export const ROLE_REPOSITORY = 'repositories.RoleRepository';
}

export namespace SessionServiceBindings {
  export const SESSION_REPOSITORY = 'repositories.SessionRepository';
}



/**
 * Constant values used when generating refresh token.
 */
export namespace RefreshTokenConstants {
  /**
   * The default secret used when generating refresh token.
   */
  export const REFRESH_SECRET_VALUE = 'r3fr35htok3n';
  /**
   * The default expiration time for refresh token.
   */
  export const REFRESH_EXPIRES_IN_VALUE = '216000';
  /**
   * The default issuer used when generating refresh token.
   */
  export const REFRESH_ISSUER_VALUE = 'loopback4';
}

/**
 * Bindings related to token refresh service. The omitted explanation can be
 * found in namespace `RefreshTokenConstants`.
 */
export namespace RefreshTokenServiceBindings {
  export const REFRESH_TOKEN_SERVICE = BindingKey.create<RefreshTokenService>(
    'services.authentication.jwt.refresh.tokenservice',
  );
  export const REFRESH_SECRET = BindingKey.create<string>(
    'authentication.jwt.refresh.secret',
  );
  export const REFRESH_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.refresh.expires.in.seconds',
  );
  export const REFRESH_ISSUER = BindingKey.create<string>(
    'authentication.jwt.refresh.issuer',
  );
  /**
   * The backend datasource for refresh token's persistency.
   */
  export const DATASOURCE_NAME = 'refreshdb';
  /**
   * Key for the repository that stores the refresh token and its bound user
   * information
   */
  export const REFRESH_REPOSITORY = 'repositories.RefreshTokenRepository';
}

export namespace RolesAndPermissionConstants {
  export enum Roles {
    ADMIN = 'admin',
    USER = 'user'
  }
  export enum Permissions {
    PROPERTY_VIEW = 'property_view',
    PROPERTY_CREATE = 'property_create',
    PROPERTY_UPDATE = 'property_update',
    PROPERTY_DELETE = 'property_delete',
    PROPERTY_GROUP_VIEW = 'property_group_view',
    PROPERTY_GROUP_CREATE = 'property_group_create',
    PROPERTY_GROUP_UPDATE = 'property_group_update',
    PROPERTY_GROUP_DELETE = 'property_group_delete',
    PROPERTY_UNIT_CREATE = 'property_unit_create',
    PROPERTY_UNIT_UPDATE = 'property_unit_update',
    PROPERTY_UNIT_DELETE = 'property_unit_delete',
  }
}

export namespace customErrorMsg {
  export enum AuthErrors {
    PASSWORD_COMPARE_ERROR = 'Password & comparePassword is not same.',
    INVALID_CREDENTIALS_ERROR = 'Invalid email or password.',
    USER_NOT_FOUND = 'User not found',
    EMAIL_EXIST = 'Email already exist.',
    VALID_PASSWORD_ERROR = 'Enter valid old password!!',
    ALREADY_EXPIRED_SESSION = 'session is already expired.',
    NOT_DELETE_SESSION = 'Session doesn’t match.',
  }
}
