import { Vector3 } from 'three';
import VisualEntity from './VisualEntity';

const SCALE = [1.0, 1.0, 1.0];
const POSITION = [0,0,0];
const MAX_TIRE_TURN_IN_RADS = 1.4;
const FACTOR_KMH_TO_MS = 1/3600;
const VELOCITY_TO_ANGULAR_VEL = 1/0.25; //Velocity/Radius
const STEERING_WHEEL_INITIAL_ROTATION_ON_X = -0.35;

export default class CarModel extends VisualEntity{
    
    
    constructor(){
        super('res/models/source/AutoConInterior.gltf');
        this.carModel = null;
        this.carLogic = null;
        this.lastValueRotation = 0;
        this.currentSpeedRotation = 0;
        this.currentWheelRotation = 0;
        this.lastSteeringRotation = 0;
    }


    async addToScene(scene){
        await super.addToScene(scene, "driverCar", POSITION, SCALE);
        return this;
    }


    animate(){
        this.moveCar();
    }


    moveCar(){
        if(this.observedState != null){
            this.threeDModel.userData.physicsBody = this.observedState["physicsBody"];
            this.threeDModel.position.set(
                this.observedState["position"].x, 
                this.observedState["position"].y, 
                this.observedState["position"].z
            );
            this.threeDModel.quaternion.set(
                this.observedState["rotation"].x, 
                this.observedState["rotation"].y, 
                this.observedState["rotation"].z, 
                this.observedState["rotation"].w
            );
            this.lastValueRotation = this.observedState["direction"];
            this.rotateWheels();
            this.rotateSteeringWheel();
        }
    }


    rotateSteeringWheel(){
        let steeringWheel = this.threeDModel.children.find(o => o.name === 'Steering_Wheel');
        let vectorRotation = new Vector3(0,0,1).applyAxisAngle(new Vector3(1,0,0), STEERING_WHEEL_INITIAL_ROTATION_ON_X);
        steeringWheel.rotateOnAxis(vectorRotation, -this.lastSteeringRotation);
        steeringWheel.rotateOnAxis(vectorRotation, -this.observedState['lastRotationWheel']*540/360*Math.PI*2);
        this.lastSteeringRotation = -this.observedState['lastRotationWheel']*540/360*Math.PI*2;
    }


    rotateWheels(){
        let wheelOne = this.threeDModel.children.find(o => o.name === 'wheel');
        let wheelTwo = this.threeDModel.children.find(o => o.name === 'wheel002');
        let wheelThree = this.threeDModel.children.find(o => o.name === 'wheel003');
        let wheelFour = this.threeDModel.children.find(o => o.name === 'wheel001');

        let rotationYVectorTwo = new Vector3(0,1,0).applyAxisAngle(
            new Vector3(1,0,0), 
            this.currentSpeedRotation
        );
        let rotationYVectorOne = new Vector3(0,1,0).applyAxisAngle(
            new Vector3(1,0,0), 
            -this.currentSpeedRotation
        );

        //Resetting position in direction
        wheelOne.rotateOnAxis(rotationYVectorOne, this.currentWheelRotation);
        wheelTwo.rotateOnAxis(rotationYVectorTwo, this.currentWheelRotation);
        
        //Moving by rotation caused by speed.
        wheelOne.rotateX(this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL);
        wheelTwo.rotateX(-this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL);
        wheelThree.rotateX(-this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL);
        wheelFour.rotateX(this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL);

        rotationYVectorTwo = new Vector3(0,1,0).applyAxisAngle(
            new Vector3(1,0,0), 
            this.currentSpeedRotation + this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL
        );
        rotationYVectorOne = new Vector3(0,1,0).applyAxisAngle(
            new Vector3(1,0,0), 
            -this.currentSpeedRotation - this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL
        );

        //Moving to the sides based on steering wheel value
        wheelOne.rotateOnAxis(rotationYVectorOne, -this.observedState['lastRotationWheel']*MAX_TIRE_TURN_IN_RADS);
        wheelTwo.rotateOnAxis(rotationYVectorTwo, -this.observedState['lastRotationWheel']*MAX_TIRE_TURN_IN_RADS);
        this.currentWheelRotation = this.observedState['lastRotationWheel']*MAX_TIRE_TURN_IN_RADS;

        this.currentSpeedRotation += this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL;
        if(this.currentSpeedRotation >= Math.PI*2){
            this.currentSpeedRotation -= Math.PI*2;
        }
    }
}