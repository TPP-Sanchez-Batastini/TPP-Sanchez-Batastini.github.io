import * as THREE from "three";
import BoxPhysics from "../LogicModel/Physics/PhysicsTypes/BoxPhysics";
import AmmoInstance from "../LogicModel/Physics/AmmoInstance";
import TrafficCone from "../3DModels/TrafficCone";
import CylinderPhysics from "../LogicModel/Physics/PhysicsTypes/CylinderPhysics";
import CustomGeometryPhysics from "../LogicModel/Physics/PhysicsTypes/CustomGeometryPhysics";
import StraightStreet from "../3DModels/StraightStreet";
import Intersection from "../3DModels/Intersection";
import Curve from "../3DModels/Curve";
import TStreet from "../3DModels/TStreet";

export default class LevelFactory {
  constructor(scene, physicsWorld) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.physicsToUpdate = [];
    this.objectsToAnimate = [];
    this.STREET_TYPES = {
      "STRAIGHT": this.createStreet.bind(this),
      "CURVE": this.createCurve.bind(this),
      "T_STREET": this.createTStreet.bind(this),
      "INTERSECTION": this.createIntersection.bind(this)
    };
  }

  updatePhysics() {
    this.physicsToUpdate.forEach(function (phys) {
      phys.updatePhysics();
    });
  }

  animate() {
    this.objectsToAnimate.forEach(function (object) {
      object.animate();
    });
  }

  async createRectangle(
    position,
    length,
    width,
    height,
    rotation,
    pathTexture,
    Ammo,
    normalMapPath = null
  ) {
    const texture = new THREE.TextureLoader().load(pathTexture);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(length, height);
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    if (normalMapPath) {
      let normalTexture = new THREE.TextureLoader().load(normalMapPath);
      normalTexture.repeat.set(length, height);
      normalTexture.wrapS = THREE.RepeatWrapping;
      normalTexture.wrapT = THREE.RepeatWrapping;
      floorMaterial.normalMap = normalTexture;
      floorMaterial.normalScale.set(10, 10);
    }
    const rampa = new THREE.BoxGeometry(length, width, height);
    rampa.rotateX(rotation);
    const quaternionRamp = new THREE.Quaternion();
    quaternionRamp.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rotation);

    let rampPhysics = new BoxPhysics(
      new THREE.Vector3(position[0], position[1], position[2]), //Position
      quaternionRamp, //Quaternion2
      new Ammo.btVector3(0, 0, 0), //Inertia
      0, //Mass
      new THREE.Vector3(length, width, height), //Shape
      this.physicsWorld, //Physics World
      1000 // friction
    );

    await rampPhysics.buildAmmoPhysics();
    this.physicsToUpdate.push(rampPhysics);
    let ramp = new THREE.Mesh(rampa, floorMaterial);
    ramp.position.set(position[0], position[1], position[2]);
    this.scene.add(ramp);
  }

  async createCone(position, Ammo) {
    let cone = new TrafficCone("textures/coneTexture.jpg");
    cone.addToScene(this.scene, "trafficCone", position, [0.5, 0.5, 0.5]);
    let conePhysics = new CylinderPhysics(
      new THREE.Vector3(position[0], position[1], position[2]), //Position
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0),
      new Ammo.btVector3(0, 0, 0),
      10,
      new THREE.Vector3(
        cone.RADIUS_BOTTOM,
        cone.HEIGHT / 2,
        cone.RADIUS_BOTTOM
      ),
      this.physicsWorld,
      1000
    );
    await conePhysics.buildAmmoPhysics();
    this.physicsToUpdate.push(conePhysics);
    conePhysics.attachObserver(cone);
    this.objectsToAnimate.push(cone);
  }

  async buildStreetPhysics(position, street, Ammo, rotationY) {
    let streetPhysics = new BoxPhysics(
      new THREE.Vector3(position[0], position[1], position[2]),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        rotationY
      ),
      new Ammo.btVector3(0, 0, 0),
      0,
      new THREE.Vector3(street.SIZE, 0.1, street.LONG),
      this.physicsWorld,
      1000
    );
    await streetPhysics.buildAmmoPhysics();
    const movingLeft = new THREE.Vector3(
      (-8.4 * street.SIZE) / 24,
      street.SIDEWALK_HEIGHT / 2,
      0
    ).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
    let leftSidewalkPhysics = new BoxPhysics(
      new THREE.Vector3(
        position[0] + movingLeft.x,
        position[1] + movingLeft.y,
        position[2] + movingLeft.z
      ),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        rotationY
      ),
      new Ammo.btVector3(0, 0, 0),
      0,
      new THREE.Vector3(
        (7 * street.SIZE) / 24,
        street.SIDEWALK_HEIGHT,
        street.LONG
      ),
      this.physicsWorld,
      1000
    );
    await leftSidewalkPhysics.buildAmmoPhysics();
    const movingRight = new THREE.Vector3(
      (8.4 * street.SIZE) / 24,
      street.SIDEWALK_HEIGHT / 2,
      0
    ).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
    let rightSidewalkPhysics = new BoxPhysics(
      new THREE.Vector3(
        position[0] + movingRight.x,
        position[1] + street.SIDEWALK_HEIGHT / 2 + movingRight.y,
        position[2] + movingRight.z
      ),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        rotationY
      ),
      new Ammo.btVector3(0, 0, 0),
      0,
      new THREE.Vector3(
        (7 * street.SIZE) / 24,
        street.SIDEWALK_HEIGHT,
        street.LONG
      ),
      this.physicsWorld,
      1000
    );
    await rightSidewalkPhysics.buildAmmoPhysics();
    streetPhysics.attachObserver(street);
    this.physicsToUpdate.push(streetPhysics);
    this.physicsToUpdate.push(leftSidewalkPhysics);
    this.physicsToUpdate.push(rightSidewalkPhysics);
  }

  async buildTStreetPhysics(position, Ammo, tStreet, rotationY) {
    let streetPhysics = new BoxPhysics(
      new THREE.Vector3(position[0], position[1], position[2]),
      new THREE.Quaternion().identity(),
      new Ammo.btVector3(0, 0, 0),
      0,
      new THREE.Vector3(30, 0.1, 30),
      this.physicsWorld,
      1000
    );
    await streetPhysics.buildAmmoPhysics();
    const movingOne = new THREE.Vector3(
        - tStreet.SIZE / 2 + tStreet.SQUARE_SIZE / 2,
        0,
        - tStreet.SIZE / 2 + tStreet.SQUARE_SIZE / 2
      ).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
    const cornerPhysicsOne = new CustomGeometryPhysics(
      new THREE.Vector3(
        position[0] + movingOne.x,
        position[1] + movingOne.y,
        position[2] + movingOne.z
      ),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI / 2 + rotationY
      ),
      new Ammo.btVector3(0, 0, 0),
      0,
      tStreet.getGeometrySidewalk(),
      this.physicsWorld,
      1000
    );
    await cornerPhysicsOne.buildAmmoPhysics();
    const movingTwo = new THREE.Vector3(
      -tStreet.SIZE / 2 + tStreet.SQUARE_SIZE / 2,
      0,
      tStreet.SIZE / 2 - tStreet.SQUARE_SIZE / 2
    ).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
    const cornerPhysicsTwo = new CustomGeometryPhysics(
      new THREE.Vector3(
        position[0] + movingTwo.x,
        position[1] + movingTwo.y,
        position[2] + movingTwo.z
      ),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI + rotationY
      ),
      new Ammo.btVector3(0, 0, 0),
      0,
      tStreet.getGeometrySidewalk(),
      this.physicsWorld,
      1000
    );
    await cornerPhysicsTwo.buildAmmoPhysics();
    const movingRight = new THREE.Vector3(
      (8.4 * tStreet.SIZE) / 24,
      tStreet.SIDEWALK_HEIGHT / 2,
      0
    ).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
    let rightSidewalkPhysics = new BoxPhysics(
      new THREE.Vector3(
        position[0] + movingRight.x,
        position[1] + movingRight.y,
        position[2] + movingRight.z
      ),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        rotationY
      ),
      new Ammo.btVector3(0, 0, 0),
      0,
      new THREE.Vector3(
        (7 * tStreet.SIZE) / 24,
        tStreet.SIDEWALK_HEIGHT,
        tStreet.SIZE
      ),
      this.physicsWorld,
      1000
    );
    await rightSidewalkPhysics.buildAmmoPhysics();
    this.physicsToUpdate.push(streetPhysics);
    this.physicsToUpdate.push(cornerPhysicsOne);
    this.physicsToUpdate.push(cornerPhysicsTwo);
    this.physicsToUpdate.push(rightSidewalkPhysics);
  }

  async buildIntersectionPhysics(position, Ammo, intersection) {
    let streetPhysics = new BoxPhysics(
      new THREE.Vector3(position[0], position[1], position[2]),
      new THREE.Quaternion().identity(),
      new Ammo.btVector3(0, 0, 0),
      0,
      new THREE.Vector3(30, 0.1, 30),
      this.physicsWorld,
      1000
    );
    await streetPhysics.buildAmmoPhysics();
    const cornerPhysicsOne = new CustomGeometryPhysics(
      new THREE.Vector3(
        position[0] - intersection.SIZE / 2 + intersection.SQUARE_SIZE / 2,
        position[1],
        position[2] - intersection.SIZE / 2 + intersection.SQUARE_SIZE / 2
      ),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI / 2
      ),
      new Ammo.btVector3(0, 0, 0),
      0,
      intersection.getGeometrySidewalk(),
      this.physicsWorld,
      1000
    );
    await cornerPhysicsOne.buildAmmoPhysics();
    const cornerPhysicsTwo = new CustomGeometryPhysics(
      new THREE.Vector3(
        position[0] - intersection.SIZE / 2 + intersection.SQUARE_SIZE / 2,
        position[1],
        position[2] + intersection.SIZE / 2 - intersection.SQUARE_SIZE / 2
      ),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI
      ),
      new Ammo.btVector3(0, 0, 0),
      0,
      intersection.getGeometrySidewalk(),
      this.physicsWorld,
      1000
    );
    await cornerPhysicsTwo.buildAmmoPhysics();
    const cornerPhysicsThree = new CustomGeometryPhysics(
      new THREE.Vector3(
        position[0] + intersection.SIZE / 2 - intersection.SQUARE_SIZE / 2,
        position[1],
        position[2] - intersection.SIZE / 2 + intersection.SQUARE_SIZE / 2
      ),
      new THREE.Quaternion().identity(),
      new Ammo.btVector3(0, 0, 0),
      0,
      intersection.getGeometrySidewalk(),
      this.physicsWorld,
      1000
    );
    await cornerPhysicsThree.buildAmmoPhysics();
    const cornerPhysicsFour = new CustomGeometryPhysics(
      new THREE.Vector3(
        position[0] + intersection.SIZE / 2 - intersection.SQUARE_SIZE / 2,
        position[1],
        position[2] + intersection.SIZE / 2 - intersection.SQUARE_SIZE / 2
      ),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        -Math.PI / 2
      ),
      new Ammo.btVector3(0, 0, 0),
      0,
      intersection.getGeometrySidewalk(),
      this.physicsWorld,
      1000
    );
    await cornerPhysicsFour.buildAmmoPhysics();
    this.physicsToUpdate.push(streetPhysics);
    this.physicsToUpdate.push(cornerPhysicsOne);
    this.physicsToUpdate.push(cornerPhysicsTwo);
    this.physicsToUpdate.push(cornerPhysicsThree);
    this.physicsToUpdate.push(cornerPhysicsFour);
  }

  async buildCurvePhysics(position, Ammo, curve, rotationY) {
    let streetPhysics = new BoxPhysics(
      new THREE.Vector3(position[0], position[1], position[2]),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        rotationY
      ),
      new Ammo.btVector3(0, 0, 0),
      0,
      new THREE.Vector3(30, 0.1, 30),
      this.physicsWorld,
      1000
    );
    await streetPhysics.buildAmmoPhysics();
    const movingCorner = new THREE.Vector3(
      -curve.SIZE / 2 + curve.SQUARE_SIZE / 2,
      0,
      -curve.SIZE / 2 + curve.SQUARE_SIZE / 2
    ).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
    const cornerPhysics = new CustomGeometryPhysics(
      new THREE.Vector3(
        position[0] + movingCorner.x,
        position[1] + movingCorner.y,
        position[2] + movingCorner.z
      ),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI / 2 + rotationY
      ),
      new Ammo.btVector3(0, 0, 0),
      0,
      curve.getGeometrySidewalk(),
      this.physicsWorld,
      1000
    );
    await cornerPhysics.buildAmmoPhysics();
    const longSidePhysics = new CustomGeometryPhysics(
      new THREE.Vector3(position[0], position[1], position[2]),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        -Math.PI / 2 + rotationY
      ),
      new Ammo.btVector3(0, 0, 0),
      0,
      curve.getGeometryLongSidewalk(),
      this.physicsWorld,
      1000
    );
    await longSidePhysics.buildAmmoPhysics();
    this.physicsToUpdate.push(streetPhysics);
    this.physicsToUpdate.push(cornerPhysics);
    this.physicsToUpdate.push(longSidePhysics);
  }

  async createStreet(position, Ammo, rotationY, segmentsQuantity) {
    let street = new StraightStreet("textures/road.jpg");
    await street.addToScene(
      this.scene,
      "street",
      position,
      segmentsQuantity,
      rotationY
    );
    await this.buildStreetPhysics(position, street, Ammo, rotationY);
    this.objectsToAnimate.push(street);
  }

  async createIntersection(position, Ammo) {
    let intersection = new Intersection("textures/CleanRoadNoBorder.jpg");
    await intersection.addToScene(this.scene, "intersection", position);
    await this.buildIntersectionPhysics(position, Ammo, intersection);
    this.objectsToAnimate.push(intersection);
  }

  async createCurve(position, Ammo, rotationY) {
    let curve = new Curve("textures/CleanRoadNoBorder.jpg");
    await curve.addToScene(this.scene, "curve", position, rotationY);
    await this.buildCurvePhysics(position, Ammo, curve, rotationY);
    this.objectsToAnimate.push(curve);
  }

  async createTStreet(position, Ammo, rotationY) {
    let tStreet = new TStreet("textures/CleanRoadNoBorder.jpg");
    console.log("T_STREET", position, rotationY);
    await tStreet.addToScene(this.scene, "tStreet", position, rotationY);
    await this.buildTStreetPhysics(position, Ammo, tStreet, rotationY);
    this.objectsToAnimate.push(tStreet);
  }

  async createLevel0() {
    let Ammo = await AmmoInstance.getInstance();
    this.createRectangle(
      [10, 0, 10],
      10,
      2,
      10,
      -Math.PI / 8,
      "textures/pavimento.jpg",
      Ammo,
      "textures/pavimento_map.png"
    );
    this.createRectangle(
      [-10, 0, 10],
      10,
      2,
      10,
      -Math.PI / 4,
      "textures/pavimento.jpg",
      Ammo,
      "textures/pavimento_map.png"
    );
    this.createRectangle(
      [0, 0, 0],
      100,
      0.1,
      100,
      0,
      "textures/pavimento.jpg",
      Ammo,
      "textures/pavimento_map.png"
    );
    this.createCone([0, 0.5, 10], Ammo);
    this.createCone([0, 0.5, 30], Ammo);
    this.createCone([0, 0.5, 20], Ammo);
  }


  async instantiateStreet(position, rotation, long, type){
    let Ammo = await AmmoInstance.getInstance();
    let segments = (long[0] === 30 ? long[1] : long[0])/30;
    this.STREET_TYPES[type]([position[0], 0, position[1]], Ammo, rotation, segments);
  }

  async createLevelCustom(json) {
    
    json.streets.forEach(street => {
      this.instantiateStreet(
        [street.position_x,street.position_y], 
        street.rotation, 
        [street.long_x, street.long_y], 
        street.type
      );
    });
  }
}
