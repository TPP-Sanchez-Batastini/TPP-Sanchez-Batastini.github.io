import VisualEntity from "./VisualEntity";
import * as THREE from 'three';

export default class TrafficCone extends VisualEntity{

    constructor(pathToTexture){
        super(pathToTexture);
        this.pathToTexture = pathToTexture;
    }

    async addToScene(scene, objectName, position, scale){
        if(!this.threeDModel){
            const geometry = new THREE.CylinderGeometry( 0.1, 0.8, 2.5, 32, undefined, true );
            const texture = new THREE.TextureLoader().load(this.pathToTexture);
            const material = new THREE.MeshBasicMaterial( { map: texture });
            const materialBox = new THREE.MeshBasicMaterial( { color: 0xd56324 } );
            const geometryPlane = new THREE.BoxGeometry(1.25, 0.1, 1.25);
            const box = new THREE.Mesh( geometryPlane, materialBox );
            box.position.set(0,0,0);
            const cone = new THREE.Mesh( geometry, material );
            cone.position.set(0,0,0);
            this.threeDModel = new THREE.Group();
            this.threeDModel.add(cone).add(box);
            this.threeDModel.name = objectName;
            this.threeDModel.position.x = position[0];
            this.threeDModel.position.y = position[1];
            this.threeDModel.position.z = position[2];
            this.threeDModel.scale.x = scale[0];
            this.threeDModel.scale.y = scale[1];
            this.threeDModel.scale.z = scale[2];
            scene.add(this.threeDModel);
        }
        return this;
    }
}