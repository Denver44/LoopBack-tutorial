import {inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  Filter,
  juggler,
  Options,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserServiceBindings} from '../keys';
import {Role, RoleRelations} from '../models';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`)
    dataSource: juggler.DataSource,
  ) {
    super(Role, dataSource);
  }

  async findOne(filter?: Filter<Role>, options?: Options): Promise<Role> {
    const result = await super.findOne(filter, options);

    if (result) {
      return result;
    } else {
      throw new HttpErrors.NotFound(`Entity not found: Role `);
    }
  }

  definePersistedModel(entityClass: typeof Role) {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', async ctx => {
      if (!ctx.isNewInstance && ctx.instance) {
        ctx.instance.updatedAt = new Date();
      }
    });
    return modelClass;
  }
}
