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
import BoxPhysics from '../LogicModel/Physics/PhysicsTypes/BoxPhysics';
import { Vector3 } from 'three';

export default class ThreeScene extends Component{
    
    
    constructor(){
        super();
        this.state = {
            "currentRPM": 0,
            "velocity": 0
        };
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

        //FLOOR
        const floorGeometry = new THREE.BoxGeometry( 5000, 10, 5000);
        const texture = new THREE.TextureLoader().load( 'textures/Piso.png' );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 0);
        let Ammo = await AmmoInstance.getInstance() ;
        this.floorPhysics = new BoxPhysics(
            new THREE.Vector3(0,-5,0), //Position
            quaternion ,  //Quaternion
            new Ammo.btVector3(0,0,0), //Inertia
            0, //Mass
            new THREE.Vector3(5000, 10, 5000), //Shape
            this.physicsWorld, //Physics World
            5 // friction
        ); 

        await this.floorPhysics.buildAmmoPhysics();
        
        texture.repeat.set( 10, 10 );
        const floorMaterial = new THREE.MeshBasicMaterial( {map: texture,  side: THREE.DoubleSide} );
        this.floor = new THREE.Mesh( floorGeometry, floorMaterial );
        this.floor.position.set (0,0,0);
        this.scene.add(this.floor);

        // Rampa 
        
        const rampa = new THREE.BoxGeometry( 100, 2, 10);
        rampa.rotateX(-Math.PI/8);
        const quaternionRamp = new THREE.Quaternion();
        quaternionRamp.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), -Math.PI / 8);

        this.ramp = new BoxPhysics(
            new THREE.Vector3(10,0,10), //Position
            quaternionRamp ,  //Quaternion
            new Ammo.btVector3(0,0,0), //Inertia
            0, //Mass
            new THREE.Vector3(100, 2, 10), //Shape
            this.physicsWorld, //Physics World
            5 // friction
        ); 
        await this.ramp.buildAmmoPhysics();
        this.ramp = new THREE.Mesh( rampa, floorMaterial );
        this.ramp.position.set (10,0,10);
        this.scene.add(this.ramp);

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

    //[3000 , 4000 ,  ]
    animation(){
        let deltaTime = this.clock.getDelta();
        requestAnimationFrame(this.animation);
        this.physicsWorld.stepSimulation(deltaTime, 10)
        this.objectsToAnimate.forEach(function(object){
            object.animate();
        });
        let floorData = this.floorPhysics.updatePhysics();
        this.floor.position.set(floorData['position'].x,floorData['position'].y, floorData['position'].z);
        this.floor.quaternion.set(floorData['rotation'].x, floorData['rotation'].y, floorData['rotation'].z, floorData['rotation'].w);
        this.camera.setPositionRelativeToObject();
        LogitechG29ControllerSingleton.getInstance(this.carLogic).checkEvents();
        //XboxControllerSingleton.getInstance(this.carLogic).checkEvents();
        this.setState({"velocity": this.carLogic.getSpeed(), "currentRPM": this.carLogic.getCurrentRPM()});
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
                </div>
                <div ref={mount => {this.mount = mount;}}></div>
            </div>
            
        );
    }
}