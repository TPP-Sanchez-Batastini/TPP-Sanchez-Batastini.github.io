import * as THREE from 'three';
import { Vector3 } from 'three';

const Y_DISTANCE = 3.0;
const Z_DISTANCE = -5.0;
const X_DISTANCE = 0.0;
export default class Camera{
    constructor(carModel){
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.carModel = carModel;
        this.setPositionRelativeToObject();
    }

    handleResize(){
        this.camera.aspect = window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    setPositionRelativeToObject(){
        const cameraOffset = new Vector3(X_DISTANCE, Y_DISTANCE, Z_DISTANCE); 
        const objectPosition = new Vector3();
        this.carModel.getModel().getWorldPosition(objectPosition);
        this.camera.position.copy(objectPosition).add(cameraOffset);
        this.camera.lookAt(objectPosition);
    }

    getCameraInstance(){
        return this.camera;
    }
}