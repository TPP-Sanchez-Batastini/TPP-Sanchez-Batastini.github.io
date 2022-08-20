import { Vector3, Vector4 } from 'three';
import Observable from '../../ObserverPattern/Observable';
import AmmoInstance from '../Physics/AmmoInstance';
import CarPhysics from '../Physics/PhysicsTypes/CarPhysics';
import CarEngine from './CarEngine';


const POSITION = [0,40,0];
const FACTOR_BRAKE_TO_FORCE = 300;
export default class Car extends Observable{

    constructor(physicsWorld){
        super();
        this.carEngine = new CarEngine();
        this.currentVelocity = 0;
        this.currentDirectionTurn = 0; //in rads
        this.currentTireRotation = 0;
        this.position = new Vector3(POSITION[0], POSITION[1], POSITION[2]);
        this.rotationQuaternion = new Vector4(0,0,0,1);
        this.mass = 1000;
        this.physicsShape = new Vector3(2,1.3,5);
        this.rotation = new Vector4(0,0,0,1);
        this.inertia = new Vector3(0,0,10);

        this.boxPhysics = new CarPhysics(this.position, this.rotationQuaternion, this.inertia, this.mass, this.physicsShape, physicsWorld, 0);
        this.boxPhysics.buildAmmoPhysics();
        
    }


    accelerate(valueClutch, valueAccelerator){
        this.carEngine.accelerate(valueClutch, valueAccelerator);
        if(this.carEngine.isInConditionToAccelerate(valueClutch)){
            this.boxPhysics.setEngineForce( this.carEngine.getCurrentRPM() );
        }
    }


    brake(valueClutch, valueBrake){
        this.carEngine.brake(valueClutch, valueBrake);
        this.boxPhysics.brake(valueBrake*FACTOR_BRAKE_TO_FORCE)
    }


    changeShift(valueClutch, newShift){
        this.carEngine.changeShift(valueClutch, newShift);
    }


    turnOnRightLight(){
        //PRENDER EL INTERMITENTE DERECHO
    }


    turnOnLeftLight(){
        //PRENDER EL INTERMITENTE DERECHO
    }

    
    turnOnCar(){
        this.carEngine.turnOn();
    }

    
    turnDirection(wheelAxesValue){
        this.currentTireRotation = wheelAxesValue;
        this.boxPhysics.setSteeringRotation( wheelAxesValue );
    }


    update(){
        let positionAndRotation = this.boxPhysics.updatePhysics();
        this.position = positionAndRotation["chassis"]["position"];
        this.rotation = positionAndRotation["chassis"]["rotation"];
        this.wheelsData = positionAndRotation["wheels"];
        super.notifyObservers(this.getDataToAnimate());
    }


    getLastRotation(){
        return this.currentTireRotation;
    }

    
    getDataToAnimate(){
        return {
            "direction": this.currentDirectionTurn, 
            "velocity": this.boxPhysics.getVelocity(), 
            "lastRotationWheel": this.currentTireRotation,
            "position": this.position,
            "rotation": this.rotation,
            "physicsBody": this.boxPhysics,
            "wheelsData": this.wheelsData
        };
    }
}