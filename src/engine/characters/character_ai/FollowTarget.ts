import * as THREE from 'three';
import { ICharacterAI } from '../../interfaces/ICharacterAI';
import * as Utils from '../../core/FunctionLibrary';
import { Vehicle } from '../../vehicles/Vehicle';
import { Character } from '../Character';
import { Car } from '../../vehicles/Car';
import { EntityType } from '../../enums/EntityType';

export class FollowTarget implements ICharacterAI {
  public character: Character;
  public isTargetReached: boolean;

  public target: THREE.Object3D;
  private stopDistance: number;

  constructor(target: THREE.Object3D, stopDistance = 1.3) {
    this.target = target;
    this.stopDistance = stopDistance;
  }

  public setTarget(target: THREE.Object3D): void {
    this.target = target;
  }

  public update(timeStep: number): void {
    if (this.character.controlledObject !== undefined) {
      const source = new THREE.Vector3();
      const target = new THREE.Vector3();

      this.character.getWorldPosition(source);
      this.target.getWorldPosition(target);

      const viewVector = new THREE.Vector3().subVectors(target, source);

      // Follow character
      if (viewVector.length() > this.stopDistance) {
        this.isTargetReached = false;
      } else {
        this.isTargetReached = true;
      }

      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(
        (this.character.controlledObject as unknown as THREE.Object3D)
          .quaternion
      );
      viewVector.y = 0;
      viewVector.normalize();
      const angle = Utils.getSignedAngleBetweenVectors(forward, viewVector);

      const goingForward =
        forward.dot(
          Utils.threeVector(
            (this.character.controlledObject as unknown as Vehicle).collision
              .velocity
          )
        ) > 0;
      const speed = (
        this.character.controlledObject as unknown as Vehicle
      ).collision.velocity.length();

      if (forward.dot(viewVector) < 0.0) {
        this.character.controlledObject.triggerAction('reverse', true);
        this.character.controlledObject.triggerAction('throttle', false);
      } else {
        this.character.controlledObject.triggerAction('throttle', true);
        this.character.controlledObject.triggerAction('reverse', false);
      }

      if (Math.abs(angle) > 0.15) {
        if (forward.dot(viewVector) > 0 || goingForward) {
          if (angle > 0) {
            this.character.controlledObject.triggerAction('left', true);
            this.character.controlledObject.triggerAction('right', false);
          } else {
            this.character.controlledObject.triggerAction('right', true);
            this.character.controlledObject.triggerAction('left', false);
          }
        } else {
          if (angle > 0) {
            this.character.controlledObject.triggerAction('right', true);
            this.character.controlledObject.triggerAction('left', false);
          } else {
            this.character.controlledObject.triggerAction('left', true);
            this.character.controlledObject.triggerAction('right', false);
          }
        }
      } else {
        this.character.controlledObject.triggerAction('left', false);
        this.character.controlledObject.triggerAction('right', false);
      }
    } else {
      const viewVector = new THREE.Vector3().subVectors(
        this.target.position,
        this.character.position
      );
      this.character.setViewVector(viewVector);

      // Follow character
      if (viewVector.length() > this.stopDistance) {
        this.isTargetReached = false;
        this.character.triggerAction('up', true);
      }
      // Stand still
      else {
        this.isTargetReached = true;
        this.character.triggerAction('up', false);

        // Look at character
        this.character.setOrientation(viewVector);
      }
    }
  }
}
