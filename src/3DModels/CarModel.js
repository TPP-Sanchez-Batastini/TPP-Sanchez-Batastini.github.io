import { Vector3 } from 'three';
import * as THREE from 'three';
import VisualEntity from './VisualEntity';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import { Object3D } from 'three';
import Models from './Models';

const SCALE = [1.0, 1.0, 1.0];
const POSITION = [0,0,0];
const MAX_TIRE_TURN_IN_RADS = 0.75;
const FACTOR_KMH_TO_MS = 1/3600;
const VELOCITY_TO_ANGULAR_VEL = 1/0.25; //Velocity/Radius
//const STEERING_WHEEL_INITIAL_ROTATION_ON_X = -0.35;
const STEERING_WHEEL_INITIAL_ROTATION_ON_X = 0.13
const MAX_VELOCITY_SHOWN = 240;
const MAX_RPM_SHOWN = 6000;

const LIGTH_TIC = 1000;

export default class CarModel extends VisualEntity{
    
    
    constructor(isIA = true){
        //super('res/models/source/AutoConInterior.glb');
        super('res/models/source/Mercedes.glb');
        this.carModel = null;
        this.carLogic = null;
        this.lastValueRotation = 0;
        this.currentSpeedRotation = 0;
        this.currentWheelRotation = 0;
        this.lastSteeringRotation = 0;
        this.lastVelocityRotation = 0;
        this.lastRPMRotation = 0;
        this.isIA = isIA;
        this.lastTurnOff = new Date();
    }


    generateRetrovisor(){
        const plane = new THREE.PlaneGeometry(0.145, 0.085);
        const graphSettings = JSON.parse(localStorage.getItem("graphic_config"));
        const retrovisor = new Reflector(
            plane,
            {
                textureWidth: window.innerWidth * graphSettings.MirrorResMultiplier,
                textureHeight: window.innerHeight * graphSettings.MirrorResMultiplier,
                clipBias: 0,
                multisample: graphSettings.AAEspejos
            }
        );
        retrovisor.rotateX( Math.PI-0.04 );
        retrovisor.rotateY( 0.35 );
        retrovisor.position.set(0.075,0.625,0.31);
        this.threeDModel.add(retrovisor);
    }


    generateLeftMirror(){
        const leftMirrorGeometry = new THREE.PlaneGeometry(0.19, 0.10);
        const graphSettings = JSON.parse(localStorage.getItem("graphic_config"));
        const leftMirror = new Reflector(
            leftMirrorGeometry, 
            {
                textureWidth: window.innerWidth * graphSettings.MirrorResMultiplier,
                textureHeight: window.innerHeight * graphSettings.MirrorResMultiplier,
                clipBias: 0,
                multisample: graphSettings.AAEspejos
            }
        );
        let container = new Object3D();
        container.add(leftMirror);
        container.position.set(0.96, 0.345, 0.62);
        container.rotateX(-Math.PI+0.13);
        leftMirror.rotateY(-18*Math.PI/180);
        this.threeDModel.add(container);
    }


    generateRightMirror(){
        const graphSettings = JSON.parse(localStorage.getItem("graphic_config"));
        const rightMirrorGeometry = new THREE.PlaneGeometry(0.19, 0.10);
        const rightMirror = new Reflector(
            rightMirrorGeometry, 
            {
                textureWidth: window.innerWidth * graphSettings.MirrorResMultiplier,
                textureHeight: window.innerHeight * graphSettings.MirrorResMultiplier,
                clipBias: 0,
                multisample: graphSettings.AAEspejos
            }
        );
        let container = new Object3D();
        container.add(rightMirror);
        container.position.set(-0.96, 0.345, 0.62);
        container.rotateX(-Math.PI+0.1);
        rightMirror.rotateY(18*Math.PI/180);
        this.threeDModel.add(container);
    }


    generateMirrors(){
        const graphSettings = JSON.parse(localStorage.getItem("graphic_config"));
        if (!this.isIA && graphSettings.CreateMirrors) {
            this.generateRetrovisor();
            this.generateLeftMirror();
            this.generateRightMirror();
        }
    }

    generateSpotlights(){
        const shouldTurnLightsOn = JSON.parse(localStorage.getItem("graphic_config")).lightsOn;
        if(!this.isIA && shouldTurnLightsOn){
            this.rightSpotlight = new THREE.SpotLight(0xffffff);
            this.leftSpotlight = new THREE.SpotLight(0xffffff);
            this.targetRight = new Object3D();
            this.targetLeft = new Object3D();
            this.targetRight.position.set(-0.8, 0.05, 3.0);
            this.targetLeft.position.set(0.8, 0.05, 3.0);
            this.rightSpotlight.position.set(-0.8, 0.3, 2.6);
            this.leftSpotlight.position.set(0.8, 0.3, 2.6);
            this.rightSpotlight.target = this.targetRight;
            this.leftSpotlight.target = this.targetLeft;
            this.leftSpotlight.castShadow = true;
            this.rightSpotlight.castShadow = true;
            this.rightSpotlight.shadow.mapSize.width = 1024;
            this.leftSpotlight.shadow.mapSize.height = 1024;
            this.rightSpotlight.shadow.camera.near = 0.1;
            this.leftSpotlight.shadow.camera.near = 0.1;
            this.rightSpotlight.shadow.camera.far = 2;
            this.leftSpotlight.shadow.camera.far = 2;
            this.rightSpotlight.shadow.camera.fov = 10;
            this.leftSpotlight.shadow.camera.fov = 10;
            this.rightSpotlight.intensity = 0.5;
            this.leftSpotlight.intensity = 0.5;
            this.rightSpotlight.angle = Math.PI/5;
            this.leftSpotlight.angle = Math.PI/5;

            this.rightSpotlight.distance = 15;
            this.leftSpotlight.distance = 15;

            this.threeDModel.add(this.leftSpotlight);
            this.threeDModel.add(this.rightSpotlight);
            this.threeDModel.add(this.targetLeft);
            this.threeDModel.add(this.targetRight);

        
            this.rightTurnlight = new THREE.SpotLight(0xDB8A10);
            this.targetTurnRight = new Object3D();
            this.targetTurnRight.position.set(-0.85, 0.05, 3.0);
            this.rightTurnlight.position.set(-0.8, 0.3, 2.6);
            this.rightTurnlight.target = this.targetTurnRight;
            this.rightTurnlight.castShadow = false;
            this.rightTurnlight.intensity = 0;
            this.rightTurnlight.angle = Math.PI/5;
            this.rightTurnlight.distance = 10;
            this.threeDModel.add(this.targetTurnRight);
            this.threeDModel.add(this.rightTurnlight);
            
    
            this.leftTurnlight = new THREE.SpotLight(0xDB8A10);
            this.targetTurnLeft = new Object3D();
            this.targetTurnLeft.position.set(0.85, 0.05, 3.0);
            this.leftTurnlight.position.set(0.8, 0.3, 2.6);
            this.leftTurnlight.target = this.targetTurnLeft;
            this.leftTurnlight.castShadow = false;
            this.leftTurnlight.intensity = 0;
            this.leftTurnlight.angle = Math.PI/5;
            this.leftTurnlight.distance = 10;
            this.threeDModel.add(this.targetTurnLeft);
            this.threeDModel.add(this.leftTurnlight);
    
    
            this.rightTurnlightBack = new THREE.SpotLight(0xDB8A10);
            this.targetTurnRightBack = new Object3D();
            this.targetTurnRightBack.position.set(-0.85, 3, -3.0);
            this.rightTurnlightBack.position.set(-0.8, 3.2, 2.6);
            this.rightTurnlightBack.target = this.targetTurnRightBack;
            this.rightTurnlightBack.castShadow = false;
            this.rightTurnlightBack.intensity = 0;
            this.rightTurnlightBack.angle = Math.PI/5;
            this.rightTurnlightBack.distance = 10;
            this.threeDModel.add(this.targetTurnRightBack);
            this.threeDModel.add(this.rightTurnlightBack);
    
            this.leftTurnlightBack = new THREE.SpotLight(0xDB8A10);
            this.targetTurnLeftBack = new Object3D();
            this.targetTurnLeftBack.position.set(0.85, 3, -3.0);
            this.leftTurnlightBack.position.set(0.8, 3.2, 2.6);
            this.leftTurnlightBack.target = this.targetTurnLeftBack;
            this.leftTurnlightBack.castShadow = false;
            this.leftTurnlightBack.intensity = 0;
            this.leftTurnlightBack.angle = Math.PI/5;
            this.leftTurnlightBack.distance = 10;
            this.threeDModel.add(this.targetTurnLeftBack);
            this.threeDModel.add(this.leftTurnlightBack);

        }
    }


    generateDirectionalLight(scene){
        if(!this.isIA){
            this.dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
            this.dirLight.target = this.threeDModel;
            this.dirLight.position.set(-2, 3, 5);
            this.dirLight.castShadow = true;
            this.dirLight.shadow.mapSize.width = window.innerWidth; // default
            this.dirLight.shadow.mapSize.height = window.innerHeight; // default
            this.dirLight.shadow.camera.near = 0.5; // default
            this.dirLight.shadow.camera.far = 50; // default
            scene.add(this.dirLight);
            //this.threeDModel.add(this.dirLight);
        }
    }


    turnRigth(){
        const shouldTurnLightsOn = JSON.parse(localStorage.getItem("graphic_config")).lightsOn;
        if (this.isIA || !shouldTurnLightsOn)
            return;
        let time = new Date();
        if(this.observedState["turnRigthLigth"]  ){
            let timePassed = time - this.lastTurnOff;
            if( timePassed < LIGTH_TIC ){
                this.rightTurnlight.intensity = 1;
                this.rightTurnlightBack.intensity = 1;
            }else if(timePassed < 2*LIGTH_TIC){
                
                this.rightTurnlight.intensity = 0;
                this.rightTurnlightBack.intensity = 0;
            }else{
                this.lastTurnOff = new Date();
            }
        }else{
            this.rightTurnlight.intensity = 0;
            this.rightTurnlightBack.intensity = 0;
        }
    }

    turnLeft(){
        const shouldTurnLightsOn = JSON.parse(localStorage.getItem("graphic_config")).lightsOn;
        if (this.isIA || !shouldTurnLightsOn)
            return;
        let time = new Date();
        if(this.observedState["turnLeftLigth"]  ){
            let timePassed = time - this.lastTurnOff;
            if( timePassed < LIGTH_TIC ){
                this.leftTurnlight.intensity = 1;
                this.leftTurnlightBack.intensity = 1;
            }else if(timePassed < 2*LIGTH_TIC){
                this.leftTurnlight.intensity = 0;
                this.leftTurnlightBack.intensity = 0;
            }else{
                this.lastTurnOff = new Date();
            }
        }else{
            this.leftTurnlight.intensity = 0;
            this.leftTurnlightBack.intensity = 0;
        }
    }


    async addToScene(scene, name="driverCar", hasMirrors = true){
        const models = await Models.getInstance();
        this.threeDModel = await models.carModel;
        this.threeDModel = this.threeDModel.clone();
        this.threeDModel.name = name;
        this.threeDModel.position.x = POSITION[0];
        this.threeDModel.position.y = POSITION[1];
        this.threeDModel.position.z = POSITION[2];
        this.threeDModel.scale.x = SCALE[0];
        this.threeDModel.scale.y = SCALE[1];
        this.threeDModel.scale.z = SCALE[2];
        scene.add(this.threeDModel);
        if(hasMirrors){
            this.generateMirrors();
        }
        this.generateSpotlights();
        this.generateDirectionalLight(scene);
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
            this.turnRigth();
            this.turnLeft();
            if (!this.isIA){
                this.dirLight.position.set(
                    this.observedState["position"].x - 2, 
                    this.observedState["position"].y + 3, 
                    this.observedState["position"].z + 5
                );
            }
        }
    }


    rotateSteeringWheel(){
        let steeringWheel = this.threeDModel.children.find(o => o.name === 'Steering_Wheel');
        let vectorRotation = new Vector3(0,0,1).applyAxisAngle(new Vector3(1,0,0), STEERING_WHEEL_INITIAL_ROTATION_ON_X);
        steeringWheel.rotateOnAxis(vectorRotation, this.lastSteeringRotation);
        steeringWheel.rotateOnAxis(vectorRotation, this.observedState['lastRotationWheel']*540/360*Math.PI*2);
        this.lastSteeringRotation = -this.observedState['lastRotationWheel']*540/360*Math.PI*2;
    }


    rotateVelocityAndRPM(){
        let velocityIndicator = this.threeDModel.children.find(o => o.name === 'Cubo001');
        let rpmIndicator = this.threeDModel.children.find(o => o.name === 'Cubo');
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
        // let wheelFrontRight = this.threeDModel.children.find(o => o.name === 'wheel002');
        // let wheelFrontLeft = this.threeDModel.children.find(o => o.name === 'wheel');
        // let wheelBackRight = this.threeDModel.children.find(o => o.name === 'wheel003');
        // let wheelBackLeft = this.threeDModel.children.find(o => o.name === 'wheel001');
        let wheelFrontRight = this.threeDModel.children.find(o => o.name === 'W222WheelFtR');
        let wheelFrontLeft = this.threeDModel.children.find(o => o.name === 'W222WheelFtL');
        let wheelBackRight = this.threeDModel.children.find(o => o.name === 'W222WheelBkR');
        let wheelBackLeft = this.threeDModel.children.find(o => o.name === 'W222WheelBkL');
        let rotationYVectorOne = new Vector3(0,1,0).applyAxisAngle(
            new Vector3(1,0,0), 
            -this.currentSpeedRotation
        );

        //Resetting position in direction
        wheelFrontLeft.rotateOnAxis(rotationYVectorOne, this.currentWheelRotation);
        wheelFrontRight.rotateOnAxis(rotationYVectorOne, this.currentWheelRotation);
        
        //Moving by rotation caused by speed.
        wheelFrontLeft.rotateX(this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL);
        wheelFrontRight.rotateX(this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL);
        wheelBackRight.rotateX(this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL);
        wheelBackLeft.rotateX(this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL);

        rotationYVectorOne = new Vector3(0,1,0).applyAxisAngle(
            new Vector3(1,0,0), 
            -this.currentSpeedRotation - this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL
        );

        //Moving to the sides based on steering wheel value
        wheelFrontLeft.rotateOnAxis(rotationYVectorOne, -this.observedState['lastRotationWheel']*MAX_TIRE_TURN_IN_RADS);
        wheelFrontRight.rotateOnAxis(rotationYVectorOne, -this.observedState['lastRotationWheel']*MAX_TIRE_TURN_IN_RADS);
        this.currentWheelRotation = this.observedState['lastRotationWheel']*MAX_TIRE_TURN_IN_RADS;

        this.currentSpeedRotation += this.observedState['velocity'] * FACTOR_KMH_TO_MS * VELOCITY_TO_ANGULAR_VEL;
        if(this.currentSpeedRotation >= Math.PI*2){
            this.currentSpeedRotation -= Math.PI*2;
        }
    }
}