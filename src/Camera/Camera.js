import * as THREE from 'three';
import { Vector3 } from 'three';
import Observer from '../ObserverPattern/Observer';

const Y_DISTANCE = 0.6;
const Z_DISTANCE = -0.1;
const X_DISTANCE = 0.35;
export default class Camera extends Observer{


    constructor(renderer){
        super();
        this.camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 0.1, 200 );
        this.group =  new THREE.Object3D();
        this.group180Rot = new THREE.Object3D().add(this.camera);
        this.group.add(this.group180Rot);
        this.renderer = renderer;
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
            
            if (localStorage.getItem("VR") == "true"){
                let offsetVectorCamera = new Vector3(0,-1.25,0); //Offset to be in place for driver's seat
                offsetVectorCamera.applyQuaternion(this.observedState.rotation);
                this.group.position.add(offsetVectorCamera);
                this.group.setRotationFromQuaternion(this.observedState.rotation);
                this.group180Rot.setRotationFromAxisAngle(new Vector3(0,1,0), Math.PI);
                this.camera.lookAt(new Vector3(0,0,5));
            }else{
                const rotationQuat = new THREE.Quaternion(this.observedState.rotation.x, this.observedState.rotation.y, this.observedState.rotation.z, this.observedState.rotation.w).normalize();
                this.group180Rot.setRotationFromAxisAngle(new Vector3(0,1,0), -5*Math.PI/180);
                this.group.quaternion.copy(rotationQuat);
            }
        }else{
            this.camera.lookAt(new Vector3(0,0,5));
        }
    }


    getCameraInstance(){
        console.log(this.camera.quaternion);
        return this.camera;
    }

    
    addContainerToScene(scene){
        scene.add(this.group);
    }
}