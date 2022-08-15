import AmmoInstance from "../AmmoInstance";

export default class BoxPhysics{

    constructor(position, quaternion, inertia, mass, shape, physicsWorld){
        this.position = position;
        this.quaternion = quaternion;
        this.inertia = inertia;
        this.mass = mass;
        this.shape = shape;
        this.physicsWorld = physicsWorld;

        this.buildAmmoPhysics();
    }

    async buildAmmoPhysics(){

        let Ammo = await AmmoInstance.getInstance();
        this.Ammo = Ammo;
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(this.position.x, this.position.y, this.position.z));
        transform.setRotation(new Ammo.btQuaternion(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w));

        this.tempTransform = new Ammo.btTransform();

        let motionState = new Ammo.btDefaultMotionState(transform);

        let shape = new Ammo.btBoxShape(this.shape.x, this.shape.y, this.shape.z);
        shape.calculateLocalInertia(this.mass, this.inertia);

        let rigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(this.mass, motionState, shape, this.inertia);
        this.rigidBody = new Ammo.btRigidBody(rigidBodyInfo);
    }

    updatePhysics(){
        let motionState = this.rigidBody.getMotionState();
        if(motionState){
            motionState.getWorldTransform(this.tempTransform);
            
            let position = this.tempTransform.getOrigin();
            let rotation = this.tempTransform.getRotation();
            return {
                "position": [position.x(), position.y(), position.z()],
                "rotation": [rotation.x(), rotation.y(), rotation.z(), rotation.w()],
            }
        }else{
            throw new Error("No motion state found in rigid body");
        }
    }

    getRigidBody(){
        return this.rigidBody;
    }
}