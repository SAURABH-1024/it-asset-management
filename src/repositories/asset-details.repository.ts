import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {AssetDetails, AssetDetailsRelations} from '../models';

export class AssetDetailsRepository extends DefaultCrudRepository<
  AssetDetails,
  typeof AssetDetails.prototype.id,
  AssetDetailsRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(AssetDetails, dataSource);
  }
}
