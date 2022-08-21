import AmmoInstance from "../AmmoInstance";
import {Vector3, Vector4} from "three";

const DISABLE_DEACTIVATION = 4;
export default class BoxPhysics{

    constructor(position, quaternion, inertia, mass, shape, physicsWorld, friction){
        this.position = position;
        this.quaternion = quaternion;
        this.inertia = inertia;
        this.mass = mass;
        this.shape = shape;
        this.physicsWorld = physicsWorld;
        if(!friction) friction = 1;
        this.friction = friction;
    }


    async buildAmmoPhysics(){

        let Ammo = await AmmoInstance.getInstance();
        this.inertia = new Ammo.btVector3(this.inertia.x, this.inertia.y, this.inertia.z);
        this.Ammo = Ammo;
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(this.position.x, this.position.y, this.position.z));
        transform.setRotation(new Ammo.btQuaternion(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w));

        this.tempTransform = new Ammo.btTransform();

        let motionState = new Ammo.btDefaultMotionState(transform);

        let shape = new Ammo.btBoxShape(new Ammo.btVector3(this.shape.x/2, this.shape.y/2, this.shape.z/2));
        shape.setMargin(0.05);
        shape.calculateLocalInertia(this.mass, this.inertia);

        let rigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(this.mass, motionState, shape, this.inertia);
        this.rigidBody = new Ammo.btRigidBody(rigidBodyInfo);

        this.rigidBody.setFriction(this.friction);

        this.physicsWorld.addRigidBody(this.rigidBody);

        if( this.mass > 0 ){
            this.rigidBody.setActivationState(DISABLE_DEACTIVATION);
        }
    }


    updatePhysics(){
        let motionState = this.rigidBody.getMotionState();
        if(motionState){
            motionState.getWorldTransform(this.tempTransform);
            
            let position = this.tempTransform.getOrigin();
            let rotation = this.tempTransform.getRotation();
            return {
                "position": new Vector3(position.x(), position.y(), position.z()),
                "rotation": new Vector4(rotation.x(), rotation.y(), rotation.z(), rotation.w()),
            }
        }else{
            throw new Error("No motion state found in rigid body");
        }
    }


    getRigidBody(){
        return this.rigidBody;
    }

    
    setLinearVelocity(velocityVector){
        let velVectorBT = new this.Ammo.btVector3(this.mass*velocityVector.x, this.mass*velocityVector.y, this.mass*velocityVector.z);
        this.rigidBody.applyForce(velVectorBT);
    }
}