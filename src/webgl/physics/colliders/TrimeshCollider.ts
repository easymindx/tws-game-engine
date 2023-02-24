import * as CANNON from 'cannon';
import * as THREE from 'three';
import * as Utils from '../../core/FunctionLibrary';
import { ICollider } from '../../interfaces/ICollider';
import { Object3D } from 'three';
import { threeToCannon } from '../../../lib/utils/three-to-cannon';

export class TrimeshCollider implements ICollider {
  public mesh: any;
  public options: any;
  public body: CANNON.Body;
  public debugModel: any;

  constructor(mesh: Object3D, options: any) {
    this.mesh = mesh.clone();

    const defaults = {
      mass: 0,
      position: mesh.position,
      rotation: mesh.quaternion,
      friction: 0.3,
    };
    options = Utils.setDefaults(options, defaults);
    this.options = options;

    const mat = new CANNON.Material('triMat');
    mat.friction = options.friction;
    // mat.restitution = 0.7;

    const shape = threeToCannon(this.mesh, { type: threeToCannon.Type.MESH });
    // shape['material'] = mat;

    // Add phys sphere
    const physBox = new CANNON.Body({
      mass: options.mass,
      position: options.position,
      quaternion: options.rotation,
      shape: shape,
    });

    physBox.material = mat;

    this.body = physBox;
  }
}
