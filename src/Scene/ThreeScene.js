import React, {Component} from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import LogitechG29ControllerSingleton from '../LogicModel/ControllerMapping/LogitechG29Controller';

export default class ThreeScene extends Component{
    componentDidMount(){
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 10;

        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.scene.add(this.light);
        this.light2 = new THREE.DirectionalLight(0xffffff, 1);
        this.scene.add(this.light2);

        this.initializeCar = this.initializeCar.bind(this);
        this.animation = this.animation.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.mount.appendChild(this.renderer.domElement);
        window.addEventListener("resize", this.handleWindowResize);
        this.initializeCar();
        window.addEventListener("gamepaddisconnected", function(e){
            LogitechG29ControllerSingleton.removeInstance();  
        });
    }

    initializeCar(){
        this.fbxLoader = new FBXLoader();
        let functionToDo = function ( carObject ) {
            this.carObject = carObject;
            this.light2.target = this.carObject;
            this.carObject.position.x = 0;
            this.carObject.position.y = 0;
            this.carObject.position.z = 0;
            this.carObject.scale.x = 0.01;
            this.carObject.scale.y = 0.01;
            this.carObject.scale.z = 0.01;
            this.scene.add(carObject);
            this.animation();
        };
        functionToDo = functionToDo.bind(this);

        this.fbxLoader.load( 
            'res/models/source/carModel.fbx', 
            functionToDo
        );
    }

    handleWindowResize(){
        this.camera.aspect = window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render( this.scene, this.camera );
    }

    animation(){
        requestAnimationFrame(this.animation);
        LogitechG29ControllerSingleton.getInstance().checkEvents();
        if(this.carObject){
            this.carObject.rotation.x += 0.01;
            this.carObject.rotation.y += 0.01;
        }
        this.renderer.render( this.scene, this.camera );
    }

    render(){
        return(
            <div ref={mount => {this.mount = mount;}}></div>
        );
    }
}