import * as CANNON from 'cannon';
import * as THREE from 'three';
import * as Utils from '../../core/FunctionLibrary';
import { ICollider } from '../../interfaces/ICollider';

export class CapsuleCollider implements ICollider {
  public options: any;
  public body: CANNON.Body;
  // public visual: THREE.Mesh;

  constructor(options: any) {
    const defaults = {
      mass: 0,
      position: new CANNON.Vec3(),
      height: 0.5,
      radius: 0.3,
      segments: 8,
      friction: 0.3,
    };
    options = Utils.setDefaults(options, defaults);
    this.options = options;

    const mat = new CANNON.Material('capsuleMat');
    mat.friction = options.friction;

    const capsuleBody = new CANNON.Body({
      mass: options.mass,
      position: options.position,
    });

    // Compound shape
    const sphereShape = new CANNON.Sphere(options.radius);

    // Materials
    capsuleBody.material = mat;
    // sphereShape.material = mat;

    capsuleBody.addShape(sphereShape, new CANNON.Vec3(0, 0, 0));
    capsuleBody.addShape(
      sphereShape,
      new CANNON.Vec3(0, options.height / 2, 0),
    );
    capsuleBody.addShape(
      sphereShape,
      new CANNON.Vec3(0, -options.height / 2, 0),
    );

    this.body = capsuleBody;
  }
}
