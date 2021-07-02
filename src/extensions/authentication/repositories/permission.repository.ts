import {inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  Filter,
  juggler,
  Options,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserServiceBindings} from '../keys';
import {Permission, PermissionRelations} from '../models';

export class PermissionRepository extends DefaultCrudRepository<
  Permission,
  typeof Permission.prototype.id,
  PermissionRelations
> {
  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`)
    dataSource: juggler.DataSource,
  ) {
    super(Permission, dataSource);
  }
  async findOne(
    filter?: Filter<Permission>,
    options?: Options,
  ): Promise<Permission> {
    const result = await super.findOne(filter, options);

    if (result) {
      return result;
    } else {
      throw new HttpErrors.NotFound(`Entity not found: `);
    }
  }

  definePersistedModel(entityClass: typeof Permission) {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', async ctx => {
      if (!ctx.isNewInstance && ctx.instance) {
        ctx.instance.updatedAt = new Date();
      }
    });
    return modelClass;
  }
}
