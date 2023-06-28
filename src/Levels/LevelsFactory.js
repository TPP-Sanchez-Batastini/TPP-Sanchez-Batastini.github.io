import * as THREE from 'three';
import BoxPhysics from '../LogicModel/Physics/PhysicsTypes/BoxPhysics';
import AmmoInstance from '../LogicModel/Physics/AmmoInstance';
import TrafficCone from '../3DModels/TrafficCone';
import CylinderPhysics from '../LogicModel/Physics/PhysicsTypes/CylinderPhysics';
import StraightStreet from '../3DModels/StraightStreet';
import Intersection from '../3DModels/Intersection';

export default class LevelFactory {


    constructor(scene,physicsWorld){
        this.scene = scene;
        this.physicsWorld = physicsWorld
        this.physicsToUpdate = [];
        this.objectsToAnimate = [];
    }


    updatePhysics(){
        this.physicsToUpdate.forEach(function(phys){
            phys.updatePhysics();
        })
    }


    animate(){
        this.objectsToAnimate.forEach(function(object){
            object.animate();
        });
    }


    async createRectangle(position,length, width, height ,rotation, pathTexture, Ammo, normalMapPath = null){
        
        const texture = new THREE.TextureLoader().load( pathTexture );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( length, height );
        const floorMaterial = new THREE.MeshStandardMaterial( {map: texture,  side: THREE.DoubleSide} );
        if( normalMapPath ){
            let normalTexture = new THREE.TextureLoader().load(
                normalMapPath
            );
            normalTexture.repeat.set( length, height );
            normalTexture.wrapS = THREE.RepeatWrapping;
            normalTexture.wrapT = THREE.RepeatWrapping;
            floorMaterial.normalMap = normalTexture;
            floorMaterial.normalScale.set(10, 10);
        }
        const rampa = new THREE.BoxGeometry( length, width, height);
        rampa.rotateX(rotation);
        const quaternionRamp = new THREE.Quaternion();
        quaternionRamp.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), rotation);

        let rampPhysics = new BoxPhysics(
            new THREE.Vector3(position[0],position[1],position[2]), //Position
            quaternionRamp ,  //Quaternion2
            new Ammo.btVector3(0,0,0), //Inertia
            0, //Mass
            new THREE.Vector3(length, width, height), //Shape
            this.physicsWorld, //Physics World
            1000 // friction
        ); 
        
        await rampPhysics.buildAmmoPhysics();
        this.physicsToUpdate.push(rampPhysics);
        let ramp = new THREE.Mesh( rampa, floorMaterial );
        ramp.position.set(position[0],position[1],position[2]);
        this.scene.add(ramp);
    }


    async createCone(position , Ammo){
        let cone = new TrafficCone("textures/coneTexture.jpg");
        cone.addToScene(this.scene, "trafficCone", position, [ 0.5, 0.5, 0.5]);
        let conePhysics = new CylinderPhysics(
            new THREE.Vector3(position[0],position[1],position[2]), //Position
            new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), 0), 
            new Ammo.btVector3(0,0,0), 
            10, 
            new THREE.Vector3(cone.RADIUS_BOTTOM, cone.HEIGHT/2, cone.RADIUS_BOTTOM), 
            this.physicsWorld,
            1000
        );
        await conePhysics.buildAmmoPhysics();
        this.physicsToUpdate.push(conePhysics);
        conePhysics.attachObserver(cone);
        this.objectsToAnimate.push(cone);
    }

    async buildStreetPhysics(position, street, Ammo){
        let streetPhysics = new BoxPhysics(
            new THREE.Vector3(position[0], position[1], position[2]),
            new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), 0), 
            new Ammo.btVector3(0,0,0), 
            0, 
            new THREE.Vector3(street.SIZE, 0.1, street.LONG), 
            this.physicsWorld,
            1000
        );
        await streetPhysics.buildAmmoPhysics();
        let leftSidewalkPhysics = new BoxPhysics(
            new THREE.Vector3(position[0]-8.4*street.SIZE/24, position[1]+street.SIDEWALK_HEIGHT/2, position[2]),
            new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), 0), 
            new Ammo.btVector3(0,0,0), 
            0, 
            new THREE.Vector3(7*street.SIZE/24, street.SIDEWALK_HEIGHT, street.LONG), 
            this.physicsWorld,
            1000
        );
        await leftSidewalkPhysics.buildAmmoPhysics();
        let rightSidewalkPhysics = new BoxPhysics(
            new THREE.Vector3(position[0]+8.4*street.SIZE/24, position[1]+street.SIDEWALK_HEIGHT/2, position[2]),
            new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), 0), 
            new Ammo.btVector3(0,0,0), 
            0, 
            new THREE.Vector3(7*street.SIZE/24, street.SIDEWALK_HEIGHT, street.LONG), 
            this.physicsWorld,
            1000
        );
        await rightSidewalkPhysics.buildAmmoPhysics();
        streetPhysics.attachObserver(street);
        this.physicsToUpdate.push(streetPhysics);
        this.physicsToUpdate.push(leftSidewalkPhysics);
        this.physicsToUpdate.push(rightSidewalkPhysics);
    }


    async createStreet(position, rotation, Ammo, segmentsQuantity){
        let street = new StraightStreet("textures/road.jpg");
        await street.addToScene(this.scene, "street", position, segmentsQuantity);
        await this.buildStreetPhysics(position, street, Ammo);
        this.objectsToAnimate.push(street);
    }


    async createIntersection(position, rotation, Ammo){
        let intersection = new Intersection("textures/CleanRoad.jpg");
        await intersection.addToScene(this.scene, "intersection", position);
        this.objectsToAnimate.push(intersection);
    }


    async createLevel0(){
        let Ammo = await AmmoInstance.getInstance();
        this.createRectangle( [ 10, 0, 10 ], 10, 2, 10, -Math.PI/8, 'textures/pavimento.jpg', Ammo, 'textures/pavimento_map.png' );
        this.createRectangle( [ -10, 0, 10 ], 10, 2, 10, -Math.PI/4, 'textures/pavimento.jpg', Ammo, 'textures/pavimento_map.png' );
        this.createRectangle( [ 0, 0, 0 ], 100, 0.1, 100, 0, 'textures/pavimento.jpg', Ammo, 'textures/pavimento_map.png' );
        this.createCone( [ 0, 0.5, 10 ], Ammo );
        this.createCone( [ 0, 0.5, 30 ], Ammo );
        this.createCone( [ 0, 0.5, 20 ], Ammo );
    }

    async createLevelCustom(){
        let Ammo = await AmmoInstance.getInstance();
        this.createStreet([0,0,0], 0, Ammo, 2);
        this.createIntersection([0,0,30+15], 0, Ammo);
    }

}

