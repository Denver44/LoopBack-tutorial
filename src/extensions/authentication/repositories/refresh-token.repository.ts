import {inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  Filter,
  juggler,
  Options,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {RefreshTokenServiceBindings} from '../keys';
import {RefreshToken, RefreshTokenRelations} from '../models';

export class RefreshTokenRepository extends DefaultCrudRepository<
  RefreshToken,
  typeof RefreshToken.prototype.id,
  RefreshTokenRelations
> {
  constructor(
    @inject(`datasources.${RefreshTokenServiceBindings.DATASOURCE_NAME}`)
    dataSource: juggler.DataSource,
  ) {
    super(RefreshToken, dataSource);
  }

  async findOne(
    filter?: Filter<RefreshToken>,
    options?: Options,
  ): Promise<RefreshToken> {
    const result = await super.findOne(filter, options);
    if (result) {
      return result;
    } else {
      throw new HttpErrors.NotFound(`Entity not found: Refresh-Token`);
    }
  }

  definePersistedModel(entityClass: typeof RefreshToken) {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', async ctx => {
      if (!ctx.isNewInstance && ctx.instance) {
        ctx.instance.updatedAt = new Date();
      }
    });
    return modelClass;
  }
}
