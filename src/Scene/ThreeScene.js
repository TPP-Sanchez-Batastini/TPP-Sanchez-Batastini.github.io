import React, {Component} from 'react';
import * as THREE from 'three';
import Camera from '../Camera/Camera';
import CarModel from '../3DModels/CarModel';
import LogitechG29ControllerSingleton from '../LogicModel/ControllerMapping/LogitechG29Controller';
import XboxControllerSingleton from '../LogicModel/ControllerMapping/XboxController';
import Car from '../LogicModel/CarLogic/Car';

export default class ThreeScene extends Component{
    
    async componentDidMount(){
        //Generate elements needed to render the scene
        this.carLogic = new Car();
        this.objectsToAnimate = [];
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        //Add elements to the scene
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(this.ambientLight);

        const floorGeometry = new THREE.PlaneGeometry( 50000, 50000 );
        const floorMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
        this.floor = new THREE.Mesh( floorGeometry, floorMaterial );
        this.floor.position.x = 0;
        this.floor.position.y = 0;
        this.floor.position.z = 0;
        this.floor.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
        this.scene.add(this.floor);
        let carModel = new CarModel();
        carModel.setCarLogic(this.carLogic);
        this.objectsToAnimate.push(await carModel.addCarRenderToScene(this.scene));
        this.camera = new Camera(carModel);

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

    handleWindowResize(){
        this.camera.handleResize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render( this.scene, this.camera.getCameraInstance() );
    }

    animation(){
        window.addEventListener("gamepadconnected", function(e) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
              e.gamepad.index, e.gamepad.id,
              e.gamepad.buttons.length, e.gamepad.axes.length);
          });
        requestAnimationFrame(this.animation);
        this.objectsToAnimate.forEach(function(object){
            object.animate();
        });
        this.camera.setPositionRelativeToObject();
        LogitechG29ControllerSingleton.getInstance(this.carLogic).checkEvents();
        XboxControllerSingleton.getInstance(this.carLogic).checkEvents();
        this.renderer.render( this.scene, this.camera.getCameraInstance() );
    }

    render(){
        return(
            <div ref={mount => {this.mount = mount;}}></div>
        );
    }
}