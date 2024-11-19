import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {AssetDetails} from '../models';
import {AssetCategory, Inventory} from '../models/inventory.model';
import {InventoryRepository} from '../repositories';

export class InventoryController {
  constructor(
    @repository(InventoryRepository)
    public inventoryRepository: InventoryRepository,
  ) { }

  @post('/inventory')
  @response(200, {
    description: 'API to post asset data available in the office into the inventory database ',
    content: {'application/json': {schema: getModelSchemaRef(Inventory)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inventory, {
            title: 'NewInventory',

          }),
        },
      },
    })
    inventory: Inventory,
  ): Promise<Inventory> {

    const checkSerialNumber = await this.inventoryRepository.findOne({where: {serialNumber: inventory.serialNumber}})
    const existingSerialNumber = checkSerialNumber?.serialNumber

    if (existingSerialNumber) {
      throw new Error('existingSerialNumber')
    }
    return this.inventoryRepository.create(inventory);
  }

  @get('/inventory/count')
  @response(200, {
    description: 'Inventory model count',

    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Inventory) where?: Where<Inventory>,
  ): Promise<Count> {
    return this.inventoryRepository.count(where);
  }

  @get('/inventory/unassignedAssets/{category}')
  @response(200, {
    description: 'Array of inventoryDetails instances filtered by category',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {type: 'object', properties: AssetDetails},
        },
      },
    },
  })
  async findByCategory(
    @param.query.string('category', {
      enum: Object.values(AssetCategory),
      description: 'The category of the IT asset',
    }) category: AssetCategory,
  ): Promise<Inventory[]> {
    // Check if category is a valid enum value
    if (!(category in AssetCategory)) {
      throw new Error('Invalid asset category');
    }

    // Find assets by category
    const assets = await this.inventoryRepository.find({
      where: {
        category: category,
        isAssigned: false
      },
    });
    return assets;
  }



  @get('/inventory/count-by-category/{category}')
  @response(200, {
    description: 'The count of assets in the specified category',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            category: {type: 'string'},
            count: {type: 'number'},
          },
        },
      },
    },
  })
  async countByCategory(
    @param.query.string('category', {
      enum: Object.values(AssetCategory),
      description: 'The category of the IT asset',
    })
    category: AssetCategory,
  ): Promise<{category: AssetCategory; count: number}> {
    // Check if the category is a valid enum value
    if (!(category in AssetCategory)) {
      throw new Error('Invalid asset category');
    }

    // Use the count method with a proper where filter
    const assetCount = await this.inventoryRepository.count({
      category: category,
      isAssigned: false
    });

    return {category, count: assetCount.count};
  }


  @get('/inventory')
  @response(200, {
    description: 'Array of Inventory model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Inventory, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Inventory) filter?: Filter<Inventory>,
  ): Promise<Inventory[]> {
    return this.inventoryRepository.find(filter);
  }

  @patch('/inventory')
  @response(200, {
    description: 'Inventory PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inventory, {partial: true}),
        },
      },
    })
    inventory: Inventory,
    @param.where(Inventory) where?: Where<Inventory>,
  ): Promise<Count> {
    return this.inventoryRepository.updateAll(inventory, where);
  }

  @get('/inventory/{id}')
  @response(200, {
    description: 'Inventory model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Inventory, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Inventory, {exclude: 'where'}) filter?: FilterExcludingWhere<Inventory>
  ): Promise<Inventory> {
    return this.inventoryRepository.findById(id, filter);
  }

  @patch('/inventory/{id}')
  @response(204, {
    description: 'Inventory PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inventory, {partial: true}),
        },
      },
    })
    inventory: Inventory,
  ): Promise<void> {
    await this.inventoryRepository.updateById(id, inventory);
  }

  @put('/inventory/{id}')
  @response(204, {
    description: 'Inventory PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() inventory: Inventory,
  ): Promise<void> {
    await this.inventoryRepository.replaceById(id, inventory);
  }

  @del('/inventory/{id}')
  @response(204, {
    description: 'Inventory DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.inventoryRepository.deleteById(id);
  }
}
