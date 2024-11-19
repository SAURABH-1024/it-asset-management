import {Entity, model, property} from '@loopback/repository';




export enum AssetCategory {
  laptop = "laptop",
  mouse = "mouse",
  headphones = "headphones",
  displayMonitor = "displayMonitor",
}

export enum AssetLocation {
  Pune = "Pune",
  Bangalore = "Bangalore",
}

export enum AssetStatus {
  InUse = "In Use",
  Available = "Available",
  InRepair = "In Repair",
  Retired = "Retired"
}


@model()
export class Inventory extends Entity {
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
  assetName: string;  // e.g., "Dell Latitude 7420"

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(AssetCategory),
    }
  })
  category: string;  // e.g., "Laptop", "Printer"

  @property({
    type: 'boolean',
    default: false
  })
  isAssigned?: boolean;

  @property({
    type: 'string',
  })
  manufacturer: string;  // e.g., "Dell", "HP"

  @property({
    type: 'string',
  })
  modelNumber: string;  // e.g., "Latitude 7420"

  @property({
    type: 'string',
    required: true,
  })
  serialNumber: string;  // Manufacturer serial number

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(AssetLocation)
    }
  })
  location: string;  // e.g., "Pune Office"

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(AssetStatus)
    }
  })
  status: string;

  @property({
    type: 'date',
  })
  purchaseDate: Date;  // Purchase date of the asset

  @property({
    type: 'date',
  })
  warrantyExpiryDate: Date;  // Warranty end date

  @property({
    type: 'string',
  })
  operatingSystem?: string;

  @property({
    type: 'string',
  })
  processor?: string;  // e.g., "Intel i7"

  @property({
    type: 'string',
  })
  ram?: string;  // e.g., "16GB"

  @property({
    type: 'string',
  })
  storage?: string;  // e.g., "512GB SSD"

  @property({
    type: 'date',
  })
  lastMaintenanceDate?: Date;  // Last service or maintenance check

  @property({
    type: 'date',
  })
  expectedReplacementDate?: Date;  // Replacement due date

  @property({
    type: 'string',
  })
  ipAddress?: string;  //If applicable,

  constructor(data?: Partial<Inventory>) {
    super(data);
  }
}

export interface InventoryRelations {
  // Describe navigational properties here if needed
}

export type ITAssetWithRelations = Inventory & InventoryRelations;
