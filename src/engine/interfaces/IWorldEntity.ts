import { World } from '../world/World';
import { EntityType } from '../enums/EntityType';
import { IUpdatable } from './IUpdatable';
import { LoadBalancing } from 'photon';

export interface IWorldEntity extends IUpdatable {
  entityType: EntityType;
  actor: LoadBalancing.Actor;

  addToWorld(world: World): void;
  removeFromWorld(world: World): void;
}
