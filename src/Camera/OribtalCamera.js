import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Observer from '../ObserverPattern/Observer';


export default class OrbitalCamera extends Observer{

    constructor(renderer){
        super();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.renderer = renderer;
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.enableZoom = true;
        this.camera.position.set(0,5.5,0);
    }

    handleResize(){
        this.camera.aspect = window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    getCameraInstance(){
        return this.camera;
    }

    setPositionRelativeToObject(){
        this.controls.update();
        if(this.observedState != null){
            this.camera.lookAt(this.observedState["position"]);
        }else{
            this.camera.lookAt(new Vector3(0,0,0));
        }
    }
}