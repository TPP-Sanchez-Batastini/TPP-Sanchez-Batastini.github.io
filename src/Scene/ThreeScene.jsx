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
import { Vector3 } from 'three';
import LevelFactory from '../Levels/LevelsFactory';
import  {VRButton}  from '../addons/VRbutton';
import Stats from "stats.js";


export default class ThreeScene extends Component{
    
    
    constructor(){
        super();
        this.state = {
            "currentRPM": 0,
            "velocity": 0,
            "currentShift": 0,
        };
        this.physicsToUpdate = [];
        localStorage.setItem("VR", false);
        this.gotAnyEvent = false;
        this.stats = new Stats();
    }


    async componentDidMount(){
        //Generate elements needed to render the scene
        this.objectsToAnimate = [];
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            powerPreference:"high-performance", 
            antialias:true });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;
        //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor( 0x87cefa, 1 );
        this.camera = new Camera(this.renderer);
        this.camera.addContainerToScene(this.scene);
        this.stats.showPanel( 0 );
        document.body.appendChild(this.stats.dom);
        this.clock = new THREE.Clock();

        //Ammo.js
        await this.createAmmo();

        //Add elements to the scene
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.directionalLight = new THREE.DirectionalLight(0xeeeeee, 1);
        this.directionalLight.position.set(0,2,5);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;
        this.directionalLight.shadow.camera.near = 0.1;
        this.directionalLight.shadow.camera.far = 1000;
        this.scene.add(this.ambientLight);
        this.scene.add(this.directionalLight);

        this.level = new LevelFactory(this.scene, this.physicsWorld);
        await this.level.createLevelCustom();
        this.physicsToUpdate.push(this.level);
        this.objectsToAnimate.push(this.level);

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
        
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.xr.enabled = true;
        this.renderer.xr.setFramebufferScaleFactor(0.75);
        this.mount.appendChild(this.renderer.domElement);
        document.body.appendChild( VRButton.createButton( this.renderer ) );
        this.renderer.setAnimationLoop(this.animation);
        
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
                    this.camera = new Camera(this.renderer);
                    this.camera.addContainerToScene(this.scene);
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
        this.stats.begin();
        let deltaTime = this.clock.getDelta();
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
        this.stats.end();
        
    }

    render(){
        return(
            <div style={{width:"100vw"}}>
                <div style={{position:"absolute", top:"10px", right:"10px", color:"red", width:"175px"}} id="Acelerador">
                    <p style={{ zIndex: 20, display: 'float', fontWeight: "bold"}} >
                        Cambio Actual: {parseInt(this.state.currentShift)}
                    </p>
                </div>
                <div ref={mount => {this.mount = mount;}}></div>
            </div>
            
        );
    }
}