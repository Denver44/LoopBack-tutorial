import {Entity, model, property} from '@loopback/repository';
import {DateTime} from 'luxon';

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class UserCredentials extends Entity {
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
      maxLength: 18,
      minLength: 8,
    },
  })
  password: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 24,
      maxLength: 30,
    },
  })
  userId: string;

  @property({
    type: 'date',
    default: () => DateTime.utc().toISO(),
  })
  createdAt?: DateTime;

  @property({
    type: 'date',
    default: () => DateTime.utc().toISO(),
  })
  updatedAt?: DateTime;

  constructor(data?: Partial<UserCredentials>) {
    super(data);
  }
}

export interface UserCredentialsRelations {
  // describe navigational properties here
}

export type UserCredentialsWithRelations = UserCredentials &
  UserCredentialsRelations;
