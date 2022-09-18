import React, {Component} from 'react';
import * as THREE from 'three';
import Camera from '../Camera/Camera';
import CarOffsetCamera from '../Camera/CarOffsetCamera';
import OrbitalCamera from '../Camera/OribtalCamera';
import CarModel from '../3DModels/CarModel';
import LogitechG29ControllerSingleton from '../LogicModel/ControllerMapping/LogitechG29Controller';
import XboxControllerSingleton from '../LogicModel/ControllerMapping/XboxController';
import Car from '../LogicModel/CarLogic/Car';
import AmmoInstance from '../LogicModel/Physics/AmmoInstance';
import CylinderPhysics from '../LogicModel/Physics/PhysicsTypes/CylinderPhysics';
import { Vector3 } from 'three';
import TrafficCone from '../3DModels/TrafficCone';
import LevelFactory from '../Levels/LevelsFactory';

export default class ThreeScene extends Component{
    
    
    constructor(){
        super();
        this.state = {
            "currentRPM": 0,
            "velocity": 0,
            "currentShift": 0,
        };
        this.physicsToUpdate = [];
    }


    async componentDidMount(){
        //Generate elements needed to render the scene
        this.objectsToAnimate = [];
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor( 0x87cefa, 1 );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.camera = new Camera();
        
        this.clock = new THREE.Clock();

        //Ammo.js
        await this.createAmmo();

        //Add elements to the scene
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(this.ambientLight);
        this.sunLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
        this.sunLight.position.set( 0, 100, 0 );
        this.scene.add( this.sunLight );
        
        let Ammo = await AmmoInstance.getInstance() ;

        this.level = new LevelFactory(0,this.scene, this.physicsWorld);
        this.physicsToUpdate.push(this.level);
        this.objectsToAnimate.push(this.level);

        this.cone = new TrafficCone("textures/coneTexture.jpg");
        this.cone.addToScene(this.scene, "trafficCone", [10,0,0], [1,1,1]);
        this.conePhysics = new CylinderPhysics(
            new THREE.Vector3(10,0,0), 
            new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), 0), 
            new Ammo.btVector3(0,0,0), 
            10, 
            new THREE.Vector3(this.cone.RADIUS_BOTTOM, this.cone.HEIGHT/2, this.cone.RADIUS_BOTTOM), 
            this.physicsWorld,
            1000
        );
        await this.conePhysics.buildAmmoPhysics();
        this.physicsToUpdate.push(this.conePhysics);
        this.conePhysics.attachObserver(this.cone);
        this.objectsToAnimate.push(this.cone);

        //Add driver's car to scene
        this.carLogic = new Car(this.physicsWorld);
        let carModel = new CarModel();
        this.carLogic.attachObserver(carModel);
        this.carLogic.attachObserver(this.camera);
        this.objectsToAnimate.push(await carModel.addToScene(this.scene));
        this.carLogic.notifyObservers();
        
        //Bind this to methods of the class
        this.animation = this.animation.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.generateEvents = this.generateEvents.bind(this);
        
        //Handle resize and gamepad connection on window.
        this.generateEvents();

        //Append canvas to DOM in HTML and start animating
        this.mount.appendChild(this.renderer.domElement);
        this.animation();

        
    }


    generateEvents(){
        window.addEventListener("resize", this.handleWindowResize);
        window.addEventListener("gamepaddisconnected", function(e){
            LogitechG29ControllerSingleton.removeInstance();  
        });

        document.addEventListener('keydown', (event) => {
            var numCamera = event.key;
            this.carLogic.removeObserver(this.camera);
            switch(numCamera){
                case "1":
                    this.camera = new Camera();
                    break;
                case "2":
                    this.camera = new OrbitalCamera(this.renderer);
                    break;
                case "3":
                    this.camera = new CarOffsetCamera(new Vector3(-4.35, 0.6, -0.1));
                    break;
                case "4":
                    this.camera = new CarOffsetCamera(new Vector3(4.35, 0.6, -0.1));
                    break;
                case "5":
                    this.camera = new CarOffsetCamera(new Vector3(0.0, 3.0, -5.0));
                    break;
                default:
                    break;
            }
            this.carLogic.attachObserver(this.camera);
            this.carLogic.notifyObservers();

          }, false);
    }


    async createAmmo(){
        let Ammo = await AmmoInstance.getInstance();
        this.tempTransform = new Ammo.btTransform();
        let collisionConfiguratation = new Ammo.btDefaultCollisionConfiguration();
        let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguratation);
        let overlappingPairCache = new Ammo.btDbvtBroadphase();
        let solver = new Ammo.btSequentialImpulseConstraintSolver();

        this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguratation);
        this.physicsWorld.setGravity(new Ammo.btVector3(0,-9.8,0));
    }


    handleWindowResize(){
        this.camera.handleResize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render( this.scene, this.camera.getCameraInstance() );
    }


    animation(){
        let deltaTime = this.clock.getDelta();
        requestAnimationFrame(this.animation);
        this.physicsWorld.stepSimulation(deltaTime, 10);
        this.objectsToAnimate.forEach(function(object){
            object.animate();
        });
        this.physicsToUpdate.forEach(function(phys){
            phys.updatePhysics();
        });
        this.camera.setPositionRelativeToObject();
        XboxControllerSingleton.getInstance(this.carLogic).checkEvents();
        this.setState({"velocity": this.carLogic.getSpeed(), "currentRPM": this.carLogic.getCurrentRPM(), "currentShift": this.carLogic.getCurrentShift()});
        this.renderer.render( this.scene, this.camera.getCameraInstance());
    }

    render(){
        return(
            <div>
                <div style={{position:"absolute", left:"10px", top:"10px", color:"red"}} id="Acelerador">
                    <p style={{ zIndex: 20, display: 'float', fontWeight: "bold"}} >
                        Velocidad: {parseInt(this.state.velocity)} km/h
                    </p>
                    <p style={{ zIndex: 20, display: 'float', fontWeight: "bold"}} >
                        RPM: {parseInt(this.state.currentRPM)}
                    </p>
                    <p style={{ zIndex: 20, display: 'float', fontWeight: "bold"}} >
                        Cambio Actual: {parseInt(this.state.currentShift)}
                    </p>
                </div>
                <div ref={mount => {this.mount = mount;}}></div>
            </div>
            
        );
    }
}