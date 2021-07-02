import { SessionRepository } from './../repositories/session.repository';
import { TokenService } from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {
  SessionServiceBindings,
  TokenServiceBindings, UserServiceBindings,
} from '../keys';
import {Session, User} from '../models';
import {findPermissionByRole} from './rolePermission.data';
import {UserService} from './user.service';
export type AuthCredentials = {
  user?: User;
  session?: Session;
  role?: string;
};

export class StrategyService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService,
    @inject(SessionServiceBindings.SESSION_REPOSITORY)
    public sessionRepository: SessionRepository,  
  ) { }

  async performJWTStrategy(request: Request) {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    // for example : Bearer xxx.yyy.zzz OR Basic {base64String}
    const authHeaderValue = <string>request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    //split the string into 2 parts : 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );
    }
    try {
      const token = parts[1];

      const userProfile: UserProfile = await this.tokenService.verifyToken(
        token,
      );

      let user;

      const session = <Session>(
        await this.sessionRepository.findSessionByToken(token)
      );

      if (session) {
        user = await this.userService.findUserById(userProfile[securityId]);
      }

      if (!session || !user) {
        throw new HttpErrors.Unauthorized();
      }
      return {
        session,
        user,
        role: user.role,
        permission: findPermissionByRole(user.role),
      };
    } catch {
      throw new HttpErrors.Unauthorized();
    }
  }
}
