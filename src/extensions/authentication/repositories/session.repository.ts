import {inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  Filter,
  juggler,
  Options,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {DateTime} from 'luxon';
import {UserServiceBindings} from '../keys';
import {Session, SessionRelations} from '../models';

export class SessionRepository extends DefaultCrudRepository<
  Session,
  typeof Session.prototype.id,
  SessionRelations
> {
  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`)
    dataSource: juggler.DataSource,
  ) {
    super(Session, dataSource);
  }

  async findOne(filter?: Filter<Session>, options?: Options): Promise<Session> {
    const result = await super.findOne(filter, options);

    if (result) {
      return result;
    } else {
      throw new HttpErrors.NotFound(`Entity not found: Session `);
    }
  }

  async findSessionByToken(token: string): Promise<Session | boolean> {
    const session = await this.findOne({
      where: {
        accessToken: token,
        status: 'current',
      },
    });
    if (!session) {
      return false;
    }

    if (
      DateTime.fromJSDate(session.expireAt).valueOf() < DateTime.utc().valueOf()
    ) {
      // change session status to expire
      await this.updateById(session.id, {
        status: 'expired',
      });

      return false;
    }

    return session;
  }

  definePersistedModel(entityClass: typeof Session) {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', async ctx => {
      if (!ctx.isNewInstance && ctx.instance) {
        ctx.instance.updatedAt = new Date();
      }
    });
    return modelClass;
  }
}
