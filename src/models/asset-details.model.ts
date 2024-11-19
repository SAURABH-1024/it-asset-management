import {Entity, model, property} from '@loopback/repository';

@model()
export class AssetDetails extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  employeeId: string;

  @property({
    type: 'string',
  })
  location: string;

  @property({
    type: 'date',
  })
  warrantyExpiryDate: string;

  @property({
    type: 'string',
  })
  status: string;

  @property({
    type: 'string',
  })
  manufacturerBrand: string;

  @property({
    type: 'string',
  })
  personAllottedTo: string;

  @property({
    type: 'string',
  })
  serialNumber: string;

  @property({
    type: 'string',
  })
  product: string;

  @property({
    type: 'date',
  })
  dateOfAllotment: string;

  constructor(data?: Partial<AssetDetails>) {
    super(data);
  }
}


export interface AssetDetailsRelations {
  // describe navigational properties here
}

export type AssetDetailsWithRelations = AssetDetails & AssetDetailsRelations;
