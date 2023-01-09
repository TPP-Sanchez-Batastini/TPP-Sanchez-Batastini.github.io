import * as THREE from 'three';
import { Vector3 } from 'three';
import Observer from '../ObserverPattern/Observer';

const Y_DISTANCE = 0.6;
const Z_DISTANCE = -0.1;
const X_DISTANCE = 0.35;
export default class Camera extends Observer{


    constructor(){
        super();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.group =  new THREE.Object3D().add(this.camera);
    }


    handleResize(){
        this.camera.aspect = window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();
    }


    setPositionRelativeToObject(){
        const cameraOffset = new Vector3(X_DISTANCE, Y_DISTANCE, Z_DISTANCE);
        if(this.observedState != null){
            cameraOffset.applyQuaternion(this.observedState.rotation);
            this.group.position.copy(this.observedState.position).add(cameraOffset);
            let positionToLookAt = new Vector3(this.observedState.position.x, this.observedState.position.y, this.observedState.position.z);
            let offsetVector = new Vector3(0,0,5);
            offsetVector.applyQuaternion(this.observedState.rotation);
            positionToLookAt.x += offsetVector.x;
            positionToLookAt.y += offsetVector.y;
            positionToLookAt.z += offsetVector.z;
            this.camera.lookAt(positionToLookAt);
        }else{
            this.camera.lookAt(new Vector3(0,0,5));
        }
    }


    getCameraInstance(){
        return this.camera;
    }
}