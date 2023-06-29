import VisualEntity from "./VisualEntity";
import * as THREE from 'three';

export default class TrafficCone extends VisualEntity{

    constructor(pathToTexture){
        super(pathToTexture);
        this.pathToTexture = pathToTexture;
        this.RADIUS_TOP = 0.1;
        this.RADIUS_BOTTOM = 0.8;
        this.HEIGHT = 1.25;
        this.observedState = null;
    }

    animate(){
        if(this.observedState != null){
            this.threeDModel.position.set(
                this.observedState["position"].x, 
                this.observedState["position"].y, 
                this.observedState["position"].z
            );
            
            this.threeDModel.quaternion.set(
                this.observedState["rotation"].x, 
                this.observedState["rotation"].y, 
                this.observedState["rotation"].z, 
                this.observedState["rotation"].w
            );
        }
        
    }


    async addToScene(scene, objectName, position, scale){
        if(!this.threeDModel){
            const geometry = new THREE.CylinderGeometry( this.RADIUS_TOP, this.RADIUS_BOTTOM, this.HEIGHT, 32, undefined, true );
            const texture = new THREE.TextureLoader().load(this.pathToTexture);
            const material = new THREE.MeshBasicMaterial( { map: texture });
            const materialBox = new THREE.MeshBasicMaterial( { color: 0xd56324 } );
            const geometryPlane = new THREE.BoxGeometry(this.RADIUS_BOTTOM*2, 0.1, this.RADIUS_BOTTOM*2);
            const box = new THREE.Mesh( geometryPlane, materialBox );
            box.position.set(0,-this.HEIGHT/2,0);
            const cone = new THREE.Mesh( geometry, material );
            cone.castShadow = true;
            cone.receiveShadow = true;
            cone.position.set(0,0,0);
            this.threeDModel = new THREE.Group();
            this.threeDModel.add(cone).add(box);
            this.threeDModel.name = objectName;
            this.threeDModel.position.set(position[0], position[1], position[2]);
            this.threeDModel.scale.set(scale[0], scale[1], scale[2]);

            this.RADIUS_TOP *= scale[0];
            this.RADIUS_BOTTOM *= scale[0];
            this.HEIGHT *= scale[1];

            scene.add(this.threeDModel);
        }
        return this;
    }
}