import {Entity, model, property} from '@loopback/repository';

@model()
export class Example extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'number',
    required: true,
  })
  qty: number;

  @property({
    type: 'number',
  })
  price?: number;


  constructor(data?: Partial<Example>) {
    super(data);
  }
}

export interface ExampleRelations {
  // describe navigational properties here
}

export type ExampleWithRelations = Example & ExampleRelations;
