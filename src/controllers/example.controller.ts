import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Example} from '../models';
import {ExampleRepository} from '../repositories';

export class ExampleController {
  constructor(
    @repository(ExampleRepository)
    public exampleRepository : ExampleRepository,
  ) {}

  @post('/examples')
  @response(200, {
    description: 'Example model instance',
    content: {'application/json': {schema: getModelSchemaRef(Example)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Example, {
            title: 'NewExample',
            
          }),
        },
      },
    })
    example: Example,
  ): Promise<Example> {
    return this.exampleRepository.create(example);
  }

  @get('/examples/count')
  @response(200, {
    description: 'Example model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Example) where?: Where<Example>,
  ): Promise<Count> {
    return this.exampleRepository.count(where);
  }

  @get('/examples')
  @response(200, {
    description: 'Array of Example model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Example, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Example) filter?: Filter<Example>,
  ): Promise<Example[]> {
    return this.exampleRepository.find(filter);
  }

  @patch('/examples')
  @response(200, {
    description: 'Example PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Example, {partial: true}),
        },
      },
    })
    example: Example,
    @param.where(Example) where?: Where<Example>,
  ): Promise<Count> {
    return this.exampleRepository.updateAll(example, where);
  }

  @get('/examples/{id}')
  @response(200, {
    description: 'Example model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Example, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Example, {exclude: 'where'}) filter?: FilterExcludingWhere<Example>
  ): Promise<Example> {
    return this.exampleRepository.findById(id, filter);
  }

  @patch('/examples/{id}')
  @response(204, {
    description: 'Example PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Example, {partial: true}),
        },
      },
    })
    example: Example,
  ): Promise<void> {
    await this.exampleRepository.updateById(id, example);
  }

  @put('/examples/{id}')
  @response(204, {
    description: 'Example PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() example: Example,
  ): Promise<void> {
    await this.exampleRepository.replaceById(id, example);
  }

  @del('/examples/{id}')
  @response(204, {
    description: 'Example DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.exampleRepository.deleteById(id);
  }
}
