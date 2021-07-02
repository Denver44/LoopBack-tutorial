import {Entity, model, property} from '@loopback/repository';
import {DateTime} from 'luxon';

@model()
export class Role extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    default: null,
  })
  description?: string;

  @property({
    type: 'string',
    default: null,
  })
  type?: string;

  @property({
    type: 'array',
    itemType: 'string',
    default: [],
  })
  permissions?: string[];

  @property({
    type: 'date',
    default: () => DateTime.utc().toISO(),
  })
  createdAt: string;

  @property({
    type: 'date',
    default: () => DateTime.utc().toISO(),
  })
  updatedAt?: string;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
