import AmmoInstance from "../AmmoInstance";
import {Vector3, Vector4} from "three";

const FRONT_LEFT = 0;
const FRONT_RIGHT = 1;
const BACK_LEFT = 2;
const BACK_RIGHT = 3;

const DISABLE_DEACTIVATION = 4;
export default class CarPhysics{


    constructor(position, quaternion, inertia, mass, shape, physicsWorld, friction){
        this.position = position;
        this.quaternion = quaternion;
        this.inertia = inertia;
        this.mass = mass;
        this.shape = shape;
        this.physicsWorld = physicsWorld;
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


        ///
        let shape = new Ammo.btBoxShape(new Ammo.btVector3(this.shape.x, this.shape.y, this.shape.z));
        shape.setMargin(0.05);
        shape.calculateLocalInertia(this.mass, this.inertia);

        let rigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(this.mass, motionState, shape, this.inertia);
        this.rigidBody = new Ammo.btRigidBody(rigidBodyInfo);

        this.rigidBody.setFriction(this.friction);

        this.physicsWorld.addRigidBody(this.rigidBody);

        //////hasta igual 

        this.tuning = new this.Ammo.btVehicleTuning();
        var rayCaster = new this.Ammo.btDefaultVehicleRaycaster(this.physicsWorld);
        this.vehicle = new this.Ammo.btRaycastVehicle(this.tuning, this.rigidBody, rayCaster);
        this.vehicle.setCoordinateSystem(0, 1, 2);
        this.physicsWorld.addAction(this.vehicle);

        var wheelAxisPositionBack = 5;
        var wheelRadiusBack = 1.5;
        var wheelWidthBack = 0.4;
        var wheelHalfTrackBack = 1;
        var wheelAxisHeightBack = 0.3;

        var wheelAxisFrontPosition = 0;
        var wheelHalfTrackFront = 1;
        var wheelAxisHeightFront = 0.3;
        var wheelRadiusFront = 1.5;
        var wheelWidthFront = 0.4;


        this.addWheel(true, new this.Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_LEFT);
        this.addWheel(true, new this.Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_RIGHT);
        this.addWheel(false, new this.Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT);
        this.addWheel(false, new this.Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT);

        if( this.mass > 0 ){
            this.rigidBody.setActivationState(DISABLE_DEACTIVATION);
        }
    }


    addWheel(isFront, pos, radius, width, index) {
        var wheelDirectionCS0 = new this.Ammo.btVector3(0, -1, 0);
        var wheelAxleCS = new this.Ammo.btVector3(-1, 0, 0);
        var suspensionStiffness = 2.0;
        var suspensionRestLength = 0.6;
        var rollInfluence = 0.2;
        var friction = 1000;
        var suspensionDamping = 1.3;
        var suspensionCompression = 2.4;
        var wheelInfo = this.vehicle.addWheel(
            pos,
            wheelDirectionCS0,
            wheelAxleCS,
            suspensionRestLength,
            radius,
            this.tuning,
            isFront
        );

        wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
        wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
        wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);
        wheelInfo.set_m_frictionSlip(friction);
        wheelInfo.set_m_rollInfluence(rollInfluence);

    }


    updatePhysics(){
        let returnValue = {
            "chassis": {
                "position": null,
                "rotation": null,
            },
            "wheels": []
        }
        for (let i=0; i < this.vehicle.getNumWheels(); i++){
            this.vehicle.updateWheelTransform(i, true);
            let transfMatrix = this.vehicle.getWheelTransformWS(i);
            let position = transfMatrix.getOrigin();
            let rotation = transfMatrix.getRotation();
            returnValue.wheels.push({
                "position": new Vector3(position.x(), position.y(), position.z()),
                "rotation": new Vector4(rotation.x(), rotation.y(), rotation.z(), rotation.w()),
            });
        }
        let worldTransformChassis = this.vehicle.getChassisWorldTransform();
            
        let position = worldTransformChassis.getOrigin();
        let rotation = worldTransformChassis.getRotation();
        returnValue.chassis = {
            "position": new Vector3(position.x(), position.y(), position.z()),
            "rotation": new Vector4(rotation.x(), rotation.y(), rotation.z(), rotation.w()),
        };
        return returnValue;
    }


    getRigidBody(){
        return this.rigidBody;
    }

    
    setEngineForce( value_RPM ){
        this.vehicle.applyEngineForce( value_RPM, BACK_LEFT );
        this.vehicle.applyEngineForce( value_RPM, BACK_RIGHT );
    }


    brake(valueBrake){
        if(this.vehicle.getCurrentSpeedKmHour() > 0.5){
            this.vehicle.setBrake(valueBrake/2, FRONT_LEFT);
            this.vehicle.setBrake(valueBrake/2, FRONT_RIGHT);
            this.vehicle.setBrake(valueBrake, BACK_LEFT);
            this.vehicle.setBrake(valueBrake, BACK_RIGHT);
        }
    }


    setSteeringRotation( rotation ){
        this.vehicle.setSteeringValue(rotation, FRONT_LEFT);
        this.vehicle.setSteeringValue(rotation, FRONT_RIGHT);
    }
}