import { Vector3, Vector4 } from 'three';
import Observable from '../../ObserverPattern/Observable';
import CarPhysics from '../Physics/PhysicsTypes/CarPhysics';
import CarEngine from './CarEngine';
import ManualBox from './ShiftBoxTypes/ManualBox';
import SemiAutomaticBox from './ShiftBoxTypes/SemiAutomaticBox';


const FACTOR_BRAKE_TO_FORCE = 300;
export default class Car extends Observable{

    constructor(physicsWorld, initialPosition, useAudio = true){
        super();
        this.carEngine = new CarEngine(useAudio);
        this.shiftBox = new SemiAutomaticBox(this.carEngine);
        this.currentDirectionTurn = 0; //in rads
        this.currentTireRotation = 0;
        this.position = new Vector3(initialPosition[0], initialPosition[1], initialPosition[2]);
        this.rotationQuaternion = new Vector4(0,0,0,1);
        this.mass = 1000;
        this.physicsShape = new Vector3(2,1.3,5);
        this.rotation = new Vector4(0,0,0,1);
        this.inertia = new Vector3(1,0,1);

        this.carPhysics = new CarPhysics(this.position, this.rotationQuaternion, this.inertia, this.mass, this.physicsShape, physicsWorld, 0);
        // this.carPhysics.buildAmmoPhysics();
        
    }


    accelerate(valueClutch, valueAccelerator){
        this.carEngine.accelerate(valueClutch, valueAccelerator,this.shiftBox);
        if(valueAccelerator > 0.1 && this.carEngine.engineCanApplyForce(valueClutch)){
            this.carPhysics.setEngineForce( this.shiftBox.getEngineForce(this.carPhysics.getVelocity(), valueClutch) );
        }else{
            this.carPhysics.setEngineForce( 0 );
        }
    }


    brake(valueClutch, valueBrake){
        this.carEngine.brake(valueClutch, valueBrake,this.shiftBox);
        //Mapping [-1;1] to [0;1]
        this.carPhysics.brake(valueBrake*FACTOR_BRAKE_TO_FORCE);
    }

    doHorn(){
        new Audio("./sounds/bocina.wav").play();
    }


    changeShift(valueClutch, newShift){
        this.shiftBox.changeShift(valueClutch, newShift, this.carPhysics.getVelocity());
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
        this.carPhysics.setSteeringRotation( wheelAxesValue );
    }


    update(){
        let positionAndRotation = this.carPhysics.updatePhysics();
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
            "velocity": this.carPhysics.getVelocity(), 
            "lastRotationWheel": this.currentTireRotation,
            "position": this.position,
            "rotation": this.rotation,
            "physicsBody": this.carPhysics,
            "wheelsData": this.wheelsData,
            "rpm": this.getCurrentRPM()
        };
    }

    getSpeed(){
        return this.carPhysics.getVelocity();
    }

    getCurrentRPM(){
        return this.carEngine.getCurrentRPM();
    }

    changeShiftBox(mode){
        if(mode ===  "semi-auto"){
            this.shiftBox = new SemiAutomaticBox(this.carEngine);
        }else if(mode === "manual"){
            //TODO: asignar boton en volante
            this.shiftBox = new ManualBox(this.carEngine);
        }
    }

    getCurrentShift(){
        return this.shiftBox.getCurrentShift();
    }
}