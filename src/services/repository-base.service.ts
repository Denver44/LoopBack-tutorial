import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Filter} from '@loopback/repository';

type RequireData = {
  filter: Filter;
  userId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repo: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any;
};

@injectable({scope: BindingScope.TRANSIENT})
export class RepositoryBaseService {
  constructor(/* Add @inject to inject parameters */) { }

  async find(
    val: RequireData,
  ): Promise<{
    list: typeof val.model[];
    count: number;
    total: number;
    hasMany: boolean;
  }> {
    if (!val?.filter?.limit) {
      val.filter.limit = 10;
    }
    const limit = val.filter.limit;
    val.filter.limit = val.filter.limit + 1;
    if (!val?.filter?.where) {
      val.filter.where = {};
    }
    if (val.userId) {
      val.filter.where = {...val.filter.where, userId: val.userId};
    }

    let list: typeof val.model[] = await val.repo.find(val.filter);
    // let total;
    // if (val.userId) {
    const total = await val.repo.count({
      userId: val.userId
    });
    // }
    let hasMany = false;
    if (list.length > limit) {
      hasMany = true;
      list = list.slice(0, -1);
    } else {
      hasMany = false;
    }

    return {
      list,
      count: list.length,
      total: total.count,
      hasMany,
    };
  }
}
