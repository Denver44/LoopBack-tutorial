import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Example, ExampleRelations} from '../models';

export class ExampleRepository extends DefaultCrudRepository<
  Example,
  typeof Example.prototype.id,
  ExampleRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Example, dataSource);
  }
}
