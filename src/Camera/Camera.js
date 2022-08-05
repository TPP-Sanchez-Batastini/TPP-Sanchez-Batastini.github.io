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
            let cameraOffsetRotated = cameraOffset.applyAxisAngle(new Vector3(0,1,0), this.observedState.direction);
            this.camera.position.copy(this.observedState.position).add(cameraOffsetRotated);
            //this.getCameraInstance.matrixWorld = [                ]
            let positionToLookAt = new Vector3(this.observedState.position.x, this.observedState.position.y, this.observedState.position.z);
            let offsetVector = new Vector3(0,0,5);
            offsetVector.applyAxisAngle(new Vector3(0,1,0), this.observedState.direction);
            positionToLookAt.x += offsetVector.x;
            positionToLookAt.y += offsetVector.y;
            positionToLookAt.z += offsetVector.z;
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