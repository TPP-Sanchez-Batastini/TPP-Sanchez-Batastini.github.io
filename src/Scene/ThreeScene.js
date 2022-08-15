import React, {Component} from 'react';
import * as THREE from 'three';
import Camera from '../Camera/Camera';
import CarModel from '../3DModels/CarModel';
import LogitechG29ControllerSingleton from '../LogicModel/ControllerMapping/LogitechG29Controller';
import XboxControllerSingleton from '../LogicModel/ControllerMapping/XboxController';
import Car from '../LogicModel/CarLogic/Car';
import AmmoInstance from '../LogicModel/Physics/AmmoInstance';
import BoxPhysics from '../LogicModel/Physics/PhysicsTypes/BoxPhysics';

export default class ThreeScene extends Component{
    
    async componentDidMount(){
        //Generate elements needed to render the scene
        this.objectsToAnimate = [];
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor( 0x87cefa, 1 );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.clock = new THREE.Clock();

        //Ammo.js
        this.createAmmo();

        //Add elements to the scene
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(this.ambientLight);
        this.sunLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
        this.sunLight.position.set( 0, 100, 0 );
        this.scene.add( this.sunLight );

        //FLOOR
        const floorGeometry = new THREE.PlaneGeometry( 5000, 5000 );
        const texture = new THREE.TextureLoader().load( 'textures/Piso.png' );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        new BoxPhysics(new THREE.Vector3(0,0,0),new THREE.Vector4(0,0,0,1) , 0, 0,new THREE.Vector3(1,0,0), this.physicsWorld);
        
        texture.repeat.set( 10, 10 );
        const floorMaterial = new THREE.MeshBasicMaterial( {map: texture,  side: THREE.DoubleSide} );
        this.floor = new THREE.Mesh( floorGeometry, floorMaterial );
        this.floor.position.x = 0;
        this.floor.position.y = 0;
        this.floor.position.z = 0;
        this.floor.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
        this.scene.add(this.floor);

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
        console.log("Cargo las fisicas del mundo")
    }

    handleWindowResize(){
        this.camera.handleResize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render( this.scene, this.camera.getCameraInstance() );
    }

    animation(){
        let deltaTime = this.clock.getDelta();
        requestAnimationFrame(this.animation);
        this.physicsWorld.stepSimulation(deltaTime, 10)
        this.objectsToAnimate.forEach(function(object){
            object.animate();
        });
        this.camera.setPositionRelativeToObject();
        LogitechG29ControllerSingleton.getInstance(this.carLogic).checkEvents();
        XboxControllerSingleton.getInstance(this.carLogic).checkEvents();
        this.renderer.render( this.scene, this.camera.getCameraInstance());
    }

    render(){
        return(
            <div ref={mount => {this.mount = mount;}}></div>
        );
    }
}