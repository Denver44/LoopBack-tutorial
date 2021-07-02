import {Entity, model, property} from '@loopback/repository';
import {DateTime} from 'luxon';

export enum SessionStatus {
  CURRENT = 'current',
  EXPIRED = 'expired',
}

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class Session extends Entity {
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
      minLength: 24,
      maxLength: 30,
    },
  })
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  accessToken: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(SessionStatus),
    },
  })
  status: string;

  @property({
    type: 'date',
    required: true,
  })
  loginAt: Date;

  @property({
    type: 'date',
    required: true,
  })
  expireAt: Date;

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

  constructor(data?: Partial<Session>) {
    super(data);
  }
}

export interface SessionRelations {
  // describe navigational properties here
}

export type SessionWithRelations = Session & SessionRelations;
