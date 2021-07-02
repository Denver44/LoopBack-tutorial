import {inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  Filter,
  juggler,
  Options,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserServiceBindings} from '../keys';
import {UserCredentials, UserCredentialsRelations} from '../models';

export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {
  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`)
    dataSource: juggler.DataSource,
  ) {
    super(UserCredentials, dataSource);
  }

  async findOne(
    filter?: Filter<UserCredentials>,
    options?: Options,
  ): Promise<UserCredentials> {
    const result = await super.findOne(filter, options);

    if (result) {
      return result;
    } else {
      throw new HttpErrors.NotFound(`Entity not found: User-Credential`);
    }
  }

  definePersistedModel(entityClass: typeof UserCredentials) {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', async ctx => {
      if (!ctx.isNewInstance && ctx.instance) {
        ctx.instance.updatedAt = new Date();
      }
    });
    return modelClass;
  }
}
