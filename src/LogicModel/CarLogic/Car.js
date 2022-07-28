import { Vector3 } from 'three';
import Observable from '../../ObserverPattern/Observable';
import CarEngine from './CarEngine';

const FRICTION_FACTOR = -0.1;
const MAX_TIRE_TURN_IN_RADS = 0.7;
const ROTATION_FACTOR_TO_VELOCITY = 0.0007;

export default class Car extends Observable{

    constructor(){
        super();
        this.carEngine = new CarEngine();
        this.currentVelocity = 0;
        this.currentDirection = [0,0,1];
        this.lastValueWheel = 0;
        this.position = new Vector3(0,0,0);
    }

    accelerate(valueClutch, valueAccelerator){
        let engineAcceleration = this.carEngine.accelerate(valueClutch, valueAccelerator);
        let frictionAcceleration = this.currentVelocity * FRICTION_FACTOR;
        this.currentVelocity += engineAcceleration + frictionAcceleration;
        this.position.x += this.currentVelocity; //
        super.notifyObservers(this.getDataToAnimate());
    }

    brake(valueClutch, valueBrake){
        let engineAcceleration = this.carEngine.brake(valueClutch, valueBrake);
        let frictionAcceleration = this.currentVelocity * FRICTION_FACTOR;
        this.currentVelocity += engineAcceleration + frictionAcceleration;
        this.position.x += this.currentVelocity; //TODO: ADAPTAR CON DIRECCION
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
        this.currentDirection[0] += MAX_TIRE_TURN_IN_RADS * wheelAxesValue * this.currentVelocity * ROTATION_FACTOR_TO_VELOCITY;
        this.currentDirection[2] += MAX_TIRE_TURN_IN_RADS * wheelAxesValue * this.currentVelocity * ROTATION_FACTOR_TO_VELOCITY;
        for(let i=0; i<this.currentDirection.length; i++)
            if(this.currentDirection[i] >= 2){
                this.currentDirection[i] = -1;
            }else if(this.currentDirection[i] <= -2){
                this.currentDirection[i] = 1;
            }
        this.lastValueWheel = wheelAxesValue;
        super.notifyObservers(this.getDataToAnimate());
    }

    getLastRotation(){
        return this.lastValueWheel;
    }

    getDataToAnimate(){
        let dirVector = [0,0,0];

        //In X we make an infinite rotation, if it surpasses the limit, then it starts from the initial value of the rotation axes.
        dirVector[0] = this.currentDirection > 1? 1 - this.currentDirection[0] : this.currentDirection[0];
        dirVector[0] = this.currentDirection < -1? 1 - this.currentDirection[0] : dirVector[0];

        //Same for Z
        dirVector[2] = this.currentDirection > 1? 2 - this.currentDirection[2] : this.currentDirection[2];
        dirVector[2] = this.currentDirection < -1? 1 - this.currentDirection[2] : dirVector[2];
        return {
            "direction": dirVector, 
            "velocity": this.currentVelocity, 
            "lastRotationWheel": this.lastValueWheel,
            "position": this.position
        };
    }
}