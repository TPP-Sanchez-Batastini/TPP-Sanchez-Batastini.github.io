import * as THREE from 'three';
import VisualEntity from "./VisualEntity";
import Models from './Models';

const SEPARATION_BETWEEN_BUILDINGS = 7;

export default class StraightStreet extends VisualEntity{
    constructor(pathToTexture){
        super(pathToTexture);
        this.pathToTexture = pathToTexture;
        this.pathToNormalMap = "textures/pavimento_map.png"
        this.SIZE = 30;
        this.SIDEWALK_HEIGHT = .4;
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

    createSidewalkMesh(scale){
        const texture = new THREE.TextureLoader().load("textures/pavimento.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 3, 10*scale );
        const materialSidewalk = new THREE.MeshBasicMaterial( {map: texture,  side: THREE.DoubleSide} );
        const geometrySidewalk = new THREE.BoxGeometry(7*this.SIZE/24, this.SIDEWALK_HEIGHT, this.SIZE);
        return new THREE.Mesh( geometrySidewalk, materialSidewalk );
    }

    createStreetMesh(scale){
        const geometry = new THREE.BoxGeometry( 10*this.SIZE/24, 0.1, this.SIZE );
        const texture = new THREE.TextureLoader().load(this.pathToTexture);
        
        texture.repeat.set( 1, 2*scale );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const material = new THREE.MeshBasicMaterial( {map: texture,  side: THREE.DoubleSide} );
        return new THREE.Mesh( geometry, material );
    }

    async loadBuildingBlock(id){
        const models = await Models.getInstance();
        const modelBuilding = await models[`building_${id}`];
        return modelBuilding.clone();
    }

    async createBuildings(position, iter){
        let model3D = await this.loadBuildingBlock(1+(parseInt(Math.random()*4)));
        model3D.name = "buildingsRight_"+iter;
        model3D.position.x = position[0]+10*this.SIZE/24;
        model3D.position.y = position[1]+this.SIDEWALK_HEIGHT+0.05;
        model3D.position.z = position[2]-this.LONG/2+4+iter*SEPARATION_BETWEEN_BUILDINGS;
        model3D.scale.x = 0.8;
        model3D.scale.y = 1;
        model3D.scale.z = 0.6;
        model3D.rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI/2);
        model3D.updateMatrix();
        model3D.updateMatrixWorld();
        model3D.matrixAutoUpdate = false;
        let secondModel3D = await this.loadBuildingBlock(1+(parseInt(Math.random()*4)));
        secondModel3D.name = "buildingsLeft_"+iter;
        secondModel3D.position.x = position[0]-10*this.SIZE/24;
        secondModel3D.position.y = position[1]+this.SIDEWALK_HEIGHT+0.05;
        secondModel3D.position.z = position[2]-this.LONG/2+4+iter*SEPARATION_BETWEEN_BUILDINGS;
        secondModel3D.scale.x = 0.8;
        secondModel3D.scale.y = 1;
        secondModel3D.scale.z = 0.6;
        secondModel3D.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI/2);
        secondModel3D.updateMatrix();
        secondModel3D.updateMatrixWorld();
        secondModel3D.matrixAutoUpdate = false;
        this.threeDModel.add(model3D, secondModel3D);
    }

    async addToScene(scene, objectName, position, scale){
        if(!this.threeDModel){
            const baseStreet = this.createStreetMesh(scale);
            const leftSidewalk = this.createSidewalkMesh(scale);
            const rightSidewalk = this.createSidewalkMesh(scale);
            baseStreet.position.set(0,0,0);
            leftSidewalk.position.set(-8.4*this.SIZE/24,this.SIDEWALK_HEIGHT/2,0);
            rightSidewalk.position.set(8.4*this.SIZE/24,this.SIDEWALK_HEIGHT/2,0);
            this.threeDModel = new THREE.Group();
            this.threeDModel.add(baseStreet).add(leftSidewalk).add(rightSidewalk)
            for (let i=0; i<4*scale; i++){
                this.createBuildings(position, i);
            }
            this.threeDModel.name = objectName;
            this.threeDModel.position.set(position[0], position[1], position[2]);
            baseStreet.scale.set(1.0, 1.0, scale);
            leftSidewalk.scale.set(1.0, 1.0, scale);
            rightSidewalk.scale.set(1.0, 1.0, scale);
            baseStreet.updateMatrix();
            baseStreet.updateMatrixWorld();
            baseStreet.matrixAutoUpdate = false;
            leftSidewalk.updateMatrix();
            leftSidewalk.updateMatrixWorld();
            leftSidewalk.matrixAutoUpdate = false;
            rightSidewalk.updateMatrix();
            rightSidewalk.updateMatrixWorld();
            rightSidewalk.matrixAutoUpdate = false;
            this.threeDModel.matrixAutoUpdate = false;
            this.LONG = this.SIZE*scale;
            scene.add(this.threeDModel);
        }
        return this;
    }
}