import * as THREE from 'three';
import VisualEntity from './VisualEntity';

export default class Checkpoint extends VisualEntity{

    constructor(checkpointsData){
        super(null);
        this.checkpointsData = checkpointsData;
        this.RADIUS = 1;
        this.HEIGHT = 5;
        this.observedState = null;
        this.stepHeartbeat = -0.002;
        this.LEAST_OPACITY = 0.25;
        this.MAX_OPACITY = 0.5;
    } 

    animate(){
        const currentOpacity = this.threeDModel.children[0].material.opacity;
        const newOpacity = currentOpacity - this.stepHeartbeat;
        this.threeDModel.children[0].material.opacity = newOpacity;
        if(newOpacity <= this.LEAST_OPACITY || newOpacity >= this.MAX_OPACITY){
            this.stepHeartbeat *= -1;
        }
        // TODO:
        // if colission with player --> cambio mi pos a la proxima pos --> Si no hay proxima pos, fin si hay un bool? Sino desaparezco?
        //  Ademas, llamar al sistema de puntos y sumar una cantidad constante de puntos
        //  ESO SE GUARDA EN CHECKPOINTS DATA
        //  VER COMO LLEGA AL PLAYER HASTA ACA
    }

    
    async addToScene(scene, objectName, position, scale){
        if(!this.threeDModel){
            const geometry = new THREE.CylinderGeometry( this.RADIUS, this.RADIUS, this.HEIGHT, 32 );
            const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.4, transparent:true });
            const checkpoint = new THREE.Mesh( geometry, material );
            checkpoint.position.set(0,0,0);
            this.threeDModel = new THREE.Group();
            this.threeDModel.add(checkpoint);
            this.threeDModel.name = objectName;
            this.threeDModel.position.set(position[0], position[1], position[2]);
            this.threeDModel.scale.set(scale[0], scale[1], scale[2]);

            this.RADIUS *= scale[0];
            this.RADIUS *= scale[0];
            this.HEIGHT *= scale[1];

            scene.add(this.threeDModel);
        }
        return this;
    }

}