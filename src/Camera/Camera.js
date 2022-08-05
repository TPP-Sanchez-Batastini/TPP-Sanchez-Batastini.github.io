import * as THREE from 'three';
import { Vector3 } from 'three';
import Observer from '../ObserverPattern/Observer';

const Y_DISTANCE = 0.75;
const Z_DISTANCE = 0;
const X_DISTANCE = 0.5;
export default class Camera extends Observer{

    constructor(){
        super();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    }

    handleResize(){
        this.camera.aspect = window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    setPositionRelativeToObject(){
        const cameraOffset = new Vector3(X_DISTANCE, Y_DISTANCE, Z_DISTANCE);
        if(this.observedState != null){
            this.camera.position.copy(this.observedState.position).add(cameraOffset);
            //this.getCameraInstance.matrixWorld = [                ]
            let positionToLookAt = new Vector3(this.observedState.position.x, this.observedState.position.y, this.observedState.position.z);
            positionToLookAt.z += 5;
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