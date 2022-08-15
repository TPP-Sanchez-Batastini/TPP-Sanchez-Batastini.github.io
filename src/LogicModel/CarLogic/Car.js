import { Vector3, Vector4 } from 'three';
import Observable from '../../ObserverPattern/Observable';
import BoxPhysics from '../Physics/PhysicsTypes/BoxPhysics';
import CarEngine from './CarEngine';

const FRICTION_FACTOR = -0.1;
const MAX_TIRE_TURN_IN_RADS = 0.7;
const ROTATION_FACTOR_TO_VELOCITY = 0.0007;
const FACTOR_KMH_TO_MS = 1/3600;
const POSITION = [0,40,0];
export default class Car extends Observable{

    constructor(physicsWorld){
        super();
        this.carEngine = new CarEngine();
        this.currentVelocity = 0;
        this.currentDirectionTurn = 0; //in rads
        this.currentTireRotation = 0;
        this.position = new Vector3(POSITION[0], POSITION[1], POSITION[2]);
        this.rotationQuaternion = new Vector4(0,0,0,1);
        this.inertia = 1;
        this.mass = 1000;
        this.physicsShape = new Vector3(1,0,0);
        this.rotation = new Vector4(0,0,0,1);

        this.boxPhysics = new BoxPhysics(this.position, this.rotationQuaternion, this.inertia, this.mass, this.physicsShape, physicsWorld);
        
    }

    accelerate(valueClutch, valueAccelerator){
        let engineAcceleration = this.carEngine.accelerate(valueClutch, valueAccelerator);
        let frictionAcceleration = this.currentVelocity * FRICTION_FACTOR;
        this.currentVelocity += engineAcceleration + frictionAcceleration;
        this.movePosition();
        super.notifyObservers(this.getDataToAnimate());
    }

    brake(valueClutch, valueBrake){
        let engineAcceleration = this.carEngine.brake(valueClutch, valueBrake);
        let frictionAcceleration = this.currentVelocity * FRICTION_FACTOR;
        this.currentVelocity += engineAcceleration + frictionAcceleration;
        this.movePosition();
        super.notifyObservers(this.getDataToAnimate());
    }

    changeShift(valueClutch, newShift){
        this.carEngine.changeShift(valueClutch, newShift);
        super.notifyObservers(this.getDataToAnimate());
    }

    turnOnRightLight(){
        //PRENDER EL INTERMITENTE DERECHO
        super.notifyObservers(this.getDataToAnimate());
    }

    turnOnLeftLight(){
        //PRENDER EL INTERMITENTE DERECHO
        super.notifyObservers(this.getDataToAnimate());
    }

    turnOnCar(){
        this.carEngine.turnOn();
        super.notifyObservers(this.getDataToAnimate());
    }

    turnDirection(wheelAxesValue){
        this.currentTireRotation = wheelAxesValue;

        let internalCarRotation = -this.currentTireRotation * MAX_TIRE_TURN_IN_RADS;
        this.currentDirectionTurn += internalCarRotation * this.currentVelocity * ROTATION_FACTOR_TO_VELOCITY;
        super.notifyObservers(this.getDataToAnimate());
    }

    movePosition(){
        let velocityVector = new Vector3(0,0,1);
        let YAxis = new Vector3(0,1,0);
        velocityVector.applyAxisAngle(YAxis, this.currentDirectionTurn);
        this.position.x += velocityVector.x;
        this.position.y += velocityVector.y;
        this.position.z += velocityVector.z;
        super.notifyObservers(this.getDataToAnimate());
    }

    update(){
        let positionAndRotation = this.boxPhysics.updatePhysics();
        this.position = positionAndRotation["position"];
        this.rotation = positionAndRotation["rotation"];
        super.notifyObservers(this.getDataToAnimate());
    }

    getLastRotation(){
        return this.currentTireRotation;
    }

    getDataToAnimate(){
        return {
            "direction": this.currentDirectionTurn, 
            "velocity": this.currentVelocity, 
            "lastRotationWheel": this.currentTireRotation,
            "position": this.position,
            "rotation": this.rotation
        };
    }
}