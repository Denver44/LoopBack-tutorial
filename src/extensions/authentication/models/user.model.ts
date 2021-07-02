import {Entity, hasOne, model, property} from '@loopback/repository';
import {DateTime} from 'luxon';
import {RolesAndPermissionConstants} from '../keys';
import {UserCredentials} from './user-credentials.model';

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 15,
      minLength: 2,
    },
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 15,
      minLength: 2,
    },
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: 'email',
      maxLength: 254,
      minLength: 5,
    },
    index: {
      unique: true,
    },
  })
  email: string;

  //added organizationName property
  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  organizationName: string;

  // @property({
  //   type: 'string',
  //   required: true,
  //   jsonSchema: {
  //     minLength: 10,
  //     maxLength: 13,
  //   },
  // })
  // phone: string;

  @property({
    type: 'date',
    default: null,
  })
  lastLogin?: DateTime;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(RolesAndPermissionConstants.Roles),
    },
  })
  role: string;

  @property({
    type: 'boolean',
    default: false,
  })
  emailVerified?: boolean;

  @property({
    type: 'string',
    default: null,
  })
  emailHash?: string;

  // @property({
  //   type: 'boolean',
  //   default: false,
  //   required: true,
  // })
  // agreement: boolean;

  @property({
    type: 'date',
    default: () => DateTime.utc().toISO(),
  })
  createdAt: DateTime;

  @property({
    type: 'date',
    default: () => DateTime.utc().toISO(),
  })
  updatedAt?: DateTime;

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
