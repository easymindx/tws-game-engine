import { World } from '../world/World';
import { LoadingManager } from '../core/LoadingManager';
import { LoadBalancing } from 'photon';

export interface ISpawnPoint {
  spawn(
    loadingManager: LoadingManager,
    world: World,
    actor: LoadBalancing.Actor
  ): void;
}
