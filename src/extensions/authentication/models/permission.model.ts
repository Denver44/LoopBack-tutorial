import {Entity, model, property} from '@loopback/repository';
import {DateTime} from 'luxon';
import {RolesAndPermissionConstants} from '../keys';

@model()
export class Permission extends Entity {
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
    type: Array,
    itemType: 'string',
    default: [RolesAndPermissionConstants.Roles.ADMIN],
  })
  roles?: string[];

  @property({
    type: 'date',
    default: () => DateTime.utc().toISO(),
  })
  createdAt?: string;

  @property({
    type: 'date',
    default: () => DateTime.utc().toISO(),
  })
  updatedAt?: string;

  constructor(data?: Partial<Permission>) {
    super(data);
  }
}

export interface PermissionRelations {
  // describe navigational properties here
}

export type PermissionWithRelations = Permission & PermissionRelations;
