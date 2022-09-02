import * as THREE from 'three';
import { Vector3 } from 'three';
import Observer from '../ObserverPattern/Observer';



export default class CarOffsetCamera extends Observer{


    constructor(positionCamera){
        super();
        this.positionCamera = positionCamera;
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    }


    handleResize(){
        this.camera.aspect = window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();
    }


    setPositionRelativeToObject(){
        const cameraOffset = new Vector3(this.positionCamera.x, this.positionCamera.y, this.positionCamera.z);
        if(this.observedState != null){
            let cameraOffsetRotated = cameraOffset.applyQuaternion(this.observedState.rotation);
            this.camera.position.copy(this.observedState.position).add(cameraOffsetRotated);
            let positionToLookAt = new Vector3(this.observedState.position.x, this.observedState.position.y, this.observedState.position.z);
            this.camera.lookAt(positionToLookAt);
        }else{
            this.camera.lookAt(new Vector3(0,0,0));
            this.camera.position.copy(cameraOffset);
        }
    }


    getCameraInstance(){
        return this.camera;
    }
}