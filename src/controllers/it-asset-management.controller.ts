import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
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
import {error} from 'console';
import {AssetDetails} from '../models';
import {AssetDetailsRepository, InventoryRepository} from '../repositories';

// import { roleAuthorizer } from '../authorisation/authorisation';

export class ItAssetManagementController {
  constructor(
    @repository(AssetDetailsRepository)
    public assetDetailsRepository: AssetDetailsRepository,
    @repository(InventoryRepository)
    public inventoryRepository: InventoryRepository,
  ) { }

  @post('/asset-details')
  @response(200, {
    description: 'AssetDetails model instance',
    content: {'application/json': {schema: getModelSchemaRef(AssetDetails)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AssetDetails, {
            title: 'NewAssetDetails',

          }),
        },
      },
    })
    assetDetails: AssetDetails,
  ): Promise<AssetDetails> {

    try {
      const {serialNumber} = assetDetails
      if (!serialNumber) {
        throw new Error('serialNumber is required.');
      }
      const existingAsset = await this.assetDetailsRepository.findOne({where: {serialNumber}});

      if (existingAsset) {
        throw error('No asset with the given serial number found.');
      }
      const inventoryItem = await this.inventoryRepository.findOne({where: {serialNumber}});
      if (inventoryItem) {
        inventoryItem.isAssigned = true;
        await this.inventoryRepository.updateById(inventoryItem.id, inventoryItem);
      }
      return await this.assetDetailsRepository.create(assetDetails);

    } catch (e) {
      throw new Error("Something went wrong")
    }

  }

  @get('/assets/by-person/{employeeId}', {
    responses: {
      '200': {
        description: 'Array of assets allotted to a specific person',
        content: {'application/json': {schema: {type: 'array', items: {'x-ts-type': AssetDetails}}}},
      },
    },
  })

  async findByPerson(
    @param.path.string('employeeId') employeeId: string,
  ): Promise<{employeeId: string, products: AssetDetails[], personAllottedTo: string}> {
    // Find all assets with the specified personAllottedTo
    const products = await this.assetDetailsRepository.find({
      where: {
        employeeId
      },
    });

    const personAllottedTo = products[0].personAllottedTo

    return {
      employeeId,
      personAllottedTo,
      products,
    };
  }



  @get('/asset-details/count')
  @response(200, {
    description: 'AssetDetails model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AssetDetails) where?: Where<AssetDetails>,
  ): Promise<Count> {
    return this.assetDetailsRepository.count(where);
  }

  @get('/asset-details')
  @response(200, {
    description: 'Array of AssetDetails model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AssetDetails, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AssetDetails) filter?: Filter<AssetDetails>,
  ): Promise<AssetDetails[]> {
    return this.assetDetailsRepository.find(filter);
  }

  @patch('/asset-details')
  @response(200, {
    description: 'AssetDetails PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AssetDetails, {partial: true}),
        },
      },
    })
    assetDetails: AssetDetails,
    @param.where(AssetDetails) where?: Where<AssetDetails>,
  ): Promise<Count> {
    return this.assetDetailsRepository.updateAll(assetDetails, where);
  }

  @patch('/asset-details/{id}')
  @response(204, {
    description: 'AssetDetails PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AssetDetails, {partial: true}),
        },
      },
    })
    assetDetails: AssetDetails,
  ): Promise<void> {
    await this.assetDetailsRepository.updateById(id, assetDetails);
  }

  @put('/asset-details/{id}')
  @response(204, {
    description: 'AssetDetails PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() assetDetails: AssetDetails,
  ): Promise<void> {
    await this.assetDetailsRepository.replaceById(id, assetDetails);
  }

  @del('/asset-details/{id}')
  @response(204, {
    description: 'AssetDetails DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.assetDetailsRepository.deleteById(id);
  }
}
