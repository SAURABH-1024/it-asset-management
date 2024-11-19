import { Entity, model, property } from '@loopback/repository';


export enum UserRole {
  user = 'user',
  admin = 'admin',
}

@model({ settings: { strict: false } })
export class Users extends Entity {
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
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(UserRole), // Ensures only valid roles are allowed
    },
    default: UserRole.user, // Default role
  })
  role: UserRole;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // Define navigational properties here if needed
}

export type UserWithRelations = Users & UsersRelations;
