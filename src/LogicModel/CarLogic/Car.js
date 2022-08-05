import { Vector3 } from 'three';
import Observable from '../../ObserverPattern/Observable';
import CarEngine from './CarEngine';

const FRICTION_FACTOR = -0.1;
const MAX_TIRE_TURN_IN_RADS = 0.7;
const ROTATION_FACTOR_TO_VELOCITY = 0.0007;
const FACTOR_KMH_TO_MS = 1/3600;
const POSITION = [0,4,0];
export default class Car extends Observable{

    constructor(){
        super();
        this.carEngine = new CarEngine();
        this.currentVelocity = 0;
        this.currentDirectionTurn = 0; //in rads
        this.currentTireRotation = 0;
        this.position = new Vector3(POSITION[0], POSITION[1], POSITION[2]);
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

        //if(this.currentTireRotation > 0.2 || this.currentTireRotation < -0.2)
           // return;
        this.currentTireRotation = wheelAxesValue;

        //Defines Max Tire Turn based on wheel axes value. Approximatedly 40°.


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
    }

    getLastRotation(){
        return this.currentTireRotation;
    }

    getDataToAnimate(){
        return {
            "direction": this.currentDirectionTurn, 
            "velocity": this.currentVelocity, 
            "lastRotationWheel": this.currentTireRotation,
            "position": this.position
        };
    }
}