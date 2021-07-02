// Uncomment these imports to begin using these cool features!
import {authenticate, TokenService} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  put,
  param,
  HttpErrors,
  post,
  requestBody,
  RequestWithSession,
  RestBindings,
} from '@loopback/rest';
import {SecurityBindings} from '@loopback/security';
import {Session} from 'inspector';
import {
  AuthCredentials,
  Credentials,
  customErrorMsg,
  RolesAndPermissionConstants,
  SessionRepository,
  TokenServiceBindings,
  User,
  UserCredentialsRepository,
  UserRepository,
  UserService,
} from '../extensions/authentication';
import {UtilService} from '../services/util.service';
import {genSalt, hash} from 'bcryptjs';
import {DateTime} from 'luxon';
import _ from 'lodash';

export class AuthController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @repository(UserRepository)
    protected userRepository: UserRepository,
    @repository(SessionRepository)
    protected sessionRepository: SessionRepository,
    @repository(UserCredentialsRepository)
    protected userCredentialsRepository: UserCredentialsRepository,
    @service(UtilService)
    public utilService: UtilService,
    @service(UserService)
    public userService: UserService,
  ) {}

  //admin login api
  @post('/auth/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user: {
                  type: User,
                },
                session: {
                  type: Session,
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            required: ['email', 'password'],
            properties: {
              email: {
                type: 'string',
                format: 'email',
                maxLength: 254,
                minLength: 5,
              },
              password: {
                type: 'string',
                minLength: 8,
              },
            },
          },
        },
      },
    })
    payload: Credentials,
    @inject(RestBindings.Http.REQUEST) request: RequestWithSession,
  ): Promise<object> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(payload);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    const EXPIRATION_PERIOD = '730h';

    // create session
    const savedSession = await this.sessionRepository.create({
      userId: user.id,
      accessToken: token,
      status: 'current',
      loginAt: DateTime.utc(),

      expireAt: DateTime.utc()
        .plus({
          hours: parseInt(EXPIRATION_PERIOD),
        })
        .toISO(),
    });
    // update last login and save it.
    user['lastLogin'] = DateTime.utc();
    await this.userRepository.update(user);

    return {
      session: savedSession,
      user: _.omit(user, 'password', 'emailHash'),
    };
  }

  //admin signup api
  @post('auth/signUp', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'firstName',
              'lastName',
              'email',
              'organizationName',
              'password',
              'cPassword',
            ],
            properties: {
              firstName: {
                type: 'string',
                minLength: 2,
                maxLength: 15,
              },
              lastName: {
                type: 'string',
                minLength: 2,
                maxLength: 15,
              },
              email: {
                type: 'string',
                format: 'email',
                maxLength: 254,
                minLength: 5,
              },
              organizationName: {
                type: 'string',
                maxLength: 13,
                minLength: 3,
              },
              password: {
                type: 'string',
                minLength: 8,
                maxLength: 18,
              },
              cPassword: {
                type: 'string',
                minLength: 8,
                maxLength: 18,
              },
            },
          },
        },
      },
    })
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      organizationName: string;
      password: string;
      cPassword: string;
    },
  ): Promise<Object> {
    const role = RolesAndPermissionConstants.Roles.ADMIN;
    if (payload.password !== payload.cPassword) {
      throw new HttpErrors.BadRequest(
        customErrorMsg.AuthErrors.PASSWORD_COMPARE_ERROR,
      );
    }

    const {email} = payload;
    await this.userRepository.checkEmail(email);
    const password = await hash(payload.password, await genSalt());
    const emailHash = await this.utilService.generateHash();

    const user = await this.userRepository.create({
      ..._.omit(payload, 'password', 'cPassword'),
      role,
      emailHash: emailHash.hash,
    });
    await this.userRepository.userCredentials(user.id).create({password});
    return {
      user,
    };
  }

  //me API -> returns the logged in user
  @authenticate('jwt-auth-strategy')
  @get('auth/me', {
    responses: {
      '200': {
        description: '',
        schema: {
          type: 'object',
        },
      },
    },
  })
  async me(
    @inject(SecurityBindings.USER)
    authCredentials: AuthCredentials,
  ): Promise<AuthCredentials> {
    return authCredentials;
  }

  @authenticate('jwt-auth-strategy')
  @put('auth/profile', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async updateById(
    @param.filter(User, {
      exclude: ['limit', 'offset', 'skip', 'where', 'include'],
    })
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string',
                minLength: 2,
                maxLength: 15,
              },
              lastName: {
                type: 'string',
                minLength: 2,
                maxLength: 15,
              },
              email: {
                type: 'string',
                format: 'email',
                maxLength: 254,
                minLength: 5,
              },
              phone: {
                type: 'string',
                maxLength: 13,
                minLength: 10,
              },
            },
          },
        },
      },
    })
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    },
    @inject(SecurityBindings.USER) authCredentials: AuthCredentials,
  ): Promise<Object> {
    const user = <User>authCredentials.user;

    await this.userRepository.findOne({
      where: {id: user.id},
    });

    await this.userRepository.updateById(user.id, payload);
    return this.userRepository.findById(user.id);
  }

  @post('auth/forgotPassword')
  async forgotPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
                require: true,
                maxLength: 254,
                minLength: 5,
              },
            },
          },
        },
      },
    })
    {email}: {email: string},
  ): Promise<object> {
    const user = await this.userRepository.findOne({
      where: {email},
    });
    const emailHash = await this.utilService.generateHash();
    await this.userRepository.updateById(user.id, {emailHash: emailHash.hash});
    // const url = `https://api-dev.pretzelpay.com/resetpassword/${emailHash.hash}`
    // TODO: send email with reset password url
    return {success: true};
  }

  @post('auth/resetPassword', {
    responses: {
      '200': {},
    },
  })
  async resetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['emailHash', 'newPassword', 'confirmPassword'],
            properties: {
              emailHash: {
                type: 'string',
                minLength: 10,
                maxLength: 100,
              },
              newPassword: {
                type: 'string',
                minLength: 8,
                maxLength: 18,
              },
              confirmPassword: {
                type: 'string',
                minLength: 8,
                maxLength: 18,
              },
            },
          },
        },
      },
    })
    {
      emailHash,
      newPassword,
      confirmPassword,
    }: {
      emailHash: string;
      newPassword: string;
      confirmPassword: string;
    },
  ): Promise<object> {
    if (newPassword !== confirmPassword) {
      throw new HttpErrors.BadRequest(
        customErrorMsg.AuthErrors.PASSWORD_COMPARE_ERROR,
      );
    }
    const user = await this.userRepository.findOne({where: {emailHash}});
    const userCredential = await this.userCredentialsRepository.findOne({
      where: {userId: user.id},
    });
    const password = await hash(newPassword, await genSalt());
    await this.userRepository.updateById(user.id, {
      emailVerified: true,
      emailHash: null!,
    });
    await this.userCredentialsRepository.updateById(userCredential.id, {
      password,
    });
    return {success: true};
  }
}
