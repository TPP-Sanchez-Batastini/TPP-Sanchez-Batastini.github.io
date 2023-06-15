import { Vector3 } from 'three';
import * as THREE from 'three';
import VisualEntity from './VisualEntity';
import { Reflector } from '../addons/Reflector';
import { Object3D } from 'three';
import Models from './Models';

const SCALE = [1.0, 1.0, 1.0];
const POSITION = [0,0,0];
const MAX_TIRE_TURN_IN_RADS = 0.75;
const FACTOR_KMH_TO_MS = 1/3600;
const VELOCITY_TO_ANGULAR_VEL = 1/0.25; //Velocity/Radius
const STEERING_WHEEL_INITIAL_ROTATION_ON_X = -0.35;
const MAX_VELOCITY_SHOWN = 240;
const MAX_RPM_SHOWN = 6000;

export default class CarModel extends VisualEntity{
    
    
    constructor(){
        super('res/models/source/AutoConInterior.glb');
        this.carModel = null;
        this.carLogic = null;
        this.lastValueRotation = 0;
        this.currentSpeedRotation = 0;
        this.currentWheelRotation = 0;
        this.lastSteeringRotation = 0;
        this.lastVelocityRotation = 0;
        this.lastRPMRotation = 0;
    }


    generateRetrovisor(){
        const path = new THREE.Shape();
        path.absellipse(0,0,0.15,0.075,0, Math.PI*2, false,0);
        const ellipseGeometry = new THREE.ShapeBufferGeometry( path );
        const retrovisor = new Reflector(
            ellipseGeometry,
            {
                textureWidth: window.innerWidth * window.devicePixelRatio,//window.innerWidth * window.devicePixelRatio,
                textureHeight: window.innerHeight * window.devicePixelRatio,//window.innerHeight * window.devicePixelRatio,
                clipBias: 0.35,
                multisample: 2
            }
        );
        retrovisor.rotateX( -Math.PI );
        retrovisor.rotateY( 0.3 );
        retrovisor.position.set(0,0.625,0.375);
        this.threeDModel.add(retrovisor);
    }


    generateLeftMirror(){
        const path = new THREE.Shape();
        path.absellipse(0,0,0.105,0.075,0, Math.PI*2, false,0);
        const leftMirrorGeometry = new THREE.ShapeBufferGeometry( path );
        const leftMirror = new Reflector(
            leftMirrorGeometry, 
            {
                textureWidth: window.innerWidth * window.devicePixelRatio,//512
                textureHeight: window.innerHeight * window.devicePixelRatio ,//512
                clipBias: 0,
                multisample: 2
            }
        );
        let container = new Object3D();
        container.add(leftMirror);
        container.position.set(1.148, 0.394, 0.538);
        container.rotateX(-Math.PI+0.03);
        leftMirror.rotateY(-26*Math.PI/180);
        this.threeDModel.add(container);
    }


    generateRightMirror(){
        const path = new THREE.Shape();
        path.absellipse(0,0,0.105,0.075,0, Math.PI*2, false,0);
        const rightMirrorGeometry = new THREE.ShapeBufferGeometry( path );
        const rightMirror = new Reflector(
            rightMirrorGeometry, 
            {
                textureWidth: window.innerWidth * window.devicePixelRatio,
                textureHeight: window.innerHeight * window.devicePixelRatio,
                clipBias: 0,
                multisample: 2
            }
        );
        let container = new Object3D();
        container.add(rightMirror);
        container.position.set(-1.138, 0.394, 0.53);
        container.rotateX(-Math.PI+2.9*Math.PI/180);
        rightMirror.rotateY(28.2*Math.PI/180);
        this.threeDModel.add(container);
    }


    generateMirrors(){
        this.generateRetrovisor();
        this.generateLeftMirror();
        this.generateRightMirror();
    }

    async addToScene(scene){
        const models = await Models.getInstance();
        this.threeDModel = await models.carModel;
        this.threeDModel.name = "driverCar";
        this.threeDModel.position.x = POSITION[0];
        this.threeDModel.position.y = POSITION[1];
        this.threeDModel.position.z = POSITION[2];
        this.threeDModel.scale.x = SCALE[0];
        this.threeDModel.scale.y = SCALE[1];
        this.threeDModel.scale.z = SCALE[2];
        scene.add(this.threeDModel);
        this.generateMirrors();
        return this;
    }


    animate(){
        this.moveCar();
        //this.watchPhysicsColliders();
    }


    addPhysicsView(scene){
        this.physicsShape = new Vector3(2,1.35,5);
        
        const Geometry = new THREE.BoxGeometry( this.physicsShape.x, this.physicsShape.y, this.physicsShape.z);
        const texture = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
        this.PHYSICSSQUARE = new THREE.Mesh( Geometry, texture );
        this.PHYSICSSQUARE.position.set (0,0,0);
        scene.add(this.PHYSICSSQUARE);

        const GeometryRueda = new THREE.CylinderGeometry( 0.35, 0.35, 0.35, 32, 32);
        GeometryRueda.rotateZ(Math.PI / 2);
        const textureRueda = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        this.wheelMesh1 =  new THREE.Mesh( GeometryRueda, textureRueda );
        this.wheelMesh1.position.set (0,4,0);
        scene.add(this.wheelMesh1);

        this.wheelMesh2 =  new THREE.Mesh( GeometryRueda, textureRueda );
        this.wheelMesh2.position.set (0,4,0);
        scene.add(this.wheelMesh2);

        this.wheelMesh3 =  new THREE.Mesh( GeometryRueda, textureRueda );
        this.wheelMesh3.position.set (0,4,0);
        scene.add(this.wheelMesh3);

        this.wheelMesh4 =  new THREE.Mesh( GeometryRueda, textureRueda );
        this.wheelMesh4.position.set (0,4,0);
        scene.add(this.wheelMesh4);
    }

    //Only for debug purpose2
    watchPhysicsColliders(){
        
        if(this.observedState != null){
            this.PHYSICSSQUARE.position.set(
                this.observedState["position"].x, 
                this.observedState["position"].y, 
                this.observedState["position"].z
            );
            this.PHYSICSSQUARE.quaternion.set(
                this.observedState["rotation"].x, 
                this.observedState["rotation"].y, 
                this.observedState["rotation"].z, 
                this.observedState["rotation"].w
            );

            this.wheelMesh1.position.set(
                this.observedState.wheelsData[0]["position"].x, 
                this.observedState.wheelsData[0]["position"].y, 
                this.observedState.wheelsData[0]["position"].z
            );
            this.wheelMesh1.quaternion.set(
                this.observedState.wheelsData[0]["rotation"].x, 
                this.observedState.wheelsData[0]["rotation"].y, 
                this.observedState.wheelsData[0]["rotation"].z, 
                this.observedState.wheelsData[0]["rotation"].w
            );

            this.wheelMesh2.position.set(
                this.observedState.wheelsData[1]["position"].x, 
                this.observedState.wheelsData[1]["position"].y, 
                this.observedState.wheelsData[1]["position"].z
            );
            this.wheelMesh2.quaternion.set(
                this.observedState.wheelsData[1]["rotation"].x, 
                this.observedState.wheelsData[1]["rotation"].y, 
                this.observedState.wheelsData[1]["rotation"].z, 
                this.observedState.wheelsData[1]["rotation"].w
            );

            this.wheelMesh3.position.set(
                this.observedState.wheelsData[2]["position"].x, 
                this.observedState.wheelsData[2]["position"].y, 
                this.observedState.wheelsData[2]["position"].z
            );
            this.wheelMesh3.quaternion.set(
                this.observedState.wheelsData[2]["rotation"].x, 
                this.observedState.wheelsData[2]["rotation"].y, 
                this.observedState.wheelsData[2]["rotation"].z, 
                this.observedState.wheelsData[2]["rotation"].w
            );

            this.wheelMesh4.position.set(
                this.observedState.wheelsData[3]["position"].x, 
                this.observedState.wheelsData[3]["position"].y, 
                this.observedState.wheelsData[3]["position"].z
            );
            this.wheelMesh4.quaternion.set(
                this.observedState.wheelsData[3]["rotation"].x, 
                this.observedState.wheelsData[3]["rotation"].y, 
                this.observedState.wheelsData[3]["rotation"].z, 
                this.observedState.wheelsData[3]["rotation"].w
            );
        }
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
            this.rotateVelocityAndRPM();
        }
    }


    rotateSteeringWheel(){
        let steeringWheel = this.threeDModel.children.find(o => o.name === 'Steering_Wheel');
        let vectorRotation = new Vector3(0,0,1).applyAxisAngle(new Vector3(1,0,0), STEERING_WHEEL_INITIAL_ROTATION_ON_X);
        steeringWheel.rotateOnAxis(vectorRotation, -this.lastSteeringRotation);
        steeringWheel.rotateOnAxis(vectorRotation, -this.observedState['lastRotationWheel']*540/360*Math.PI*2);
        this.lastSteeringRotation = -this.observedState['lastRotationWheel']*540/360*Math.PI*2;
    }


    rotateVelocityAndRPM(){
        let velocityIndicator = this.threeDModel.children.find(o => o.name === 'Cubo');
        let rpmIndicator = this.threeDModel.children.find(o => o.name === 'Cubo001');
        const newVelRotation = -Math.abs(this.observedState["velocity"])*(240*Math.PI/180)/MAX_VELOCITY_SHOWN;
        const newRPMRotation = -this.observedState["rpm"]*(260*Math.PI/180)/MAX_RPM_SHOWN; //Can surpass a little bit the rpm meter
        velocityIndicator.rotateOnAxis(new Vector3(0,1,0), -this.lastVelocityRotation);
        velocityIndicator.rotateOnAxis(new Vector3(0,1,0), newVelRotation);
        rpmIndicator.rotateOnAxis(new Vector3(0,1,0), -this.lastRPMRotation);
        rpmIndicator.rotateOnAxis(new Vector3(0,1,0), newRPMRotation);
        this.lastVelocityRotation = newVelRotation;
        this.lastRPMRotation = newRPMRotation;
    }


    rotateWheels(){
        let wheelFrontRight = this.threeDModel.children.find(o => o.name === 'wheel002');
        let wheelFrontLeft = this.threeDModel.children.find(o => o.name === 'wheel');
        let wheelBackRight = this.threeDModel.children.find(o => o.name === 'wheel003');
        let wheelBackLeft = this.threeDModel.children.find(o => o.name === 'wheel001');

        let rotationYVectorTwo = new Vector3(0,1,0).applyAxisAngle(
            new Vector3(1,0,0), 
            this.currentSpeedRotation
        );
        let rotationYVectorOne = new Vector3(0,1,0).applyAxisAngle(
            new Vector3(1,0,0), 
            -this.currentSpeedRotation
        );

        //Resetting position in direction
        wheelFrontLeft.rotateOnAxis(rotationYVectorOne, this.currentWheelRotation);
        wheelFrontRight.rotateOnAxis(rotationYVectorTwo, this.currentWheelRotation);
        
        //Moving by rotation caused by speed.
        wheelFrontLeft.rotateX(this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL);
        wheelFrontRight.rotateX(-this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL);
        wheelBackRight.rotateX(-this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL);
        wheelBackLeft.rotateX(this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL);

        rotationYVectorTwo = new Vector3(0,1,0).applyAxisAngle(
            new Vector3(1,0,0), 
            this.currentSpeedRotation + this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL
        );
        rotationYVectorOne = new Vector3(0,1,0).applyAxisAngle(
            new Vector3(1,0,0), 
            -this.currentSpeedRotation - this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL
        );

        //Moving to the sides based on steering wheel value
        wheelFrontLeft.rotateOnAxis(rotationYVectorOne, -this.observedState['lastRotationWheel']*MAX_TIRE_TURN_IN_RADS);
        wheelFrontRight.rotateOnAxis(rotationYVectorTwo, -this.observedState['lastRotationWheel']*MAX_TIRE_TURN_IN_RADS);
        this.currentWheelRotation = this.observedState['lastRotationWheel']*MAX_TIRE_TURN_IN_RADS;

        this.currentSpeedRotation += this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL;
        if(this.currentSpeedRotation >= Math.PI*2){
            this.currentSpeedRotation -= Math.PI*2;
        }
    }
}