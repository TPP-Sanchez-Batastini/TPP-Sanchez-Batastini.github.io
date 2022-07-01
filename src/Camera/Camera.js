import * as THREE from 'three';

export default class Camera{
    constructor(posX, posY, posZ){
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.x = posX;
        this.camera.position.y = posY;
        this.camera.position.z = posZ;
        this.camera.position.y = 1;
    }

    handleResize(){
        this.camera.aspect = window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    getCameraInstance(){
        return this.camera;
    }
}