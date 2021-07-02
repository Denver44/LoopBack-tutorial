import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  Filter,
  HasOneRepositoryFactory,
  juggler,
  Options,
  repository
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {customErrorMsg, UserServiceBindings} from '../keys';
import {User, UserCredentials, UserRelations} from '../models';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {UserCredentialsRepository} from './user-credentials.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {
  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;
  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`)
    dataSource: juggler.DataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
  ) {
    super(User, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver,
    );
  }

  async checkEmail(email: typeof User.prototype.email) {
    const checkEmail = await super.findOne({
      where: {email: email},
    });
    if (checkEmail) {
      throw new HttpErrors.BadRequest(customErrorMsg.AuthErrors.EMAIL_EXIST);
    }
  }

  // async checkPhone(phone: typeof User.prototype.phone) {
  //   const phoneExistError = 'phone number already exist !!';
  //   const checkPhone = await super.findOne({
  //     where: {phone: phone},
  //   });
  //   if (checkPhone) {
  //     throw new HttpErrors.BadRequest(phoneExistError);
  //   }
  // }
  
  async findOne(filter?: Filter<User>, options?: Options): Promise<User> {
    const result = await super.findOne(filter, options);

    if (result) {
      return result;
    } else {
      throw new HttpErrors.NotFound(customErrorMsg.AuthErrors.USER_NOT_FOUND);
    }
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }



  definePersistedModel(entityClass: typeof User) {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', async ctx => {
      if (!ctx.isNewInstance && ctx.instance) {
        ctx.instance.updatedAt = new Date();
      }
    });
    return modelClass;
  }
}
