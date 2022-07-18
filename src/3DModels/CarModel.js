import { Vector3 } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const SCALE = [0.01, 0.01, 0.01];
const POSITION = [0,4,0];
const MAX_CAR_ROTATION = 0.7; //In rads.

export default class CarModel{
    
    constructor(){
        this.fbxLoader = new FBXLoader();
        this.carModel = null;
        this.carLogic = null;
        this.lastValueRotation = 0;
    }

    async loadFBX(){
        const result = await this.fbxLoader.loadAsync( 
            'res/models/source/carModel.fbx', 
            function ( carObject ) {
                return carObject;
            }
        );
        return result;
    }

    async addCarRenderToScene(scene){
        if(!this.carModel){
            let carModelVar = await this.loadFBX(); 
            this.carModel = carModelVar;
            this.carModel.position.x = POSITION[0];
            this.carModel.name = "carModel";
            this.carModel.position.y = POSITION[1];
            this.carModel.position.z = POSITION[2];
            this.carModel.scale.x = SCALE[0];
            this.carModel.scale.y = SCALE[1];
            this.carModel.scale.z = SCALE[2];
            console.log(this.carModel);
            scene.add(this.carModel);
            return this;
        }
    }

    setCarLogic(carLogic){
        this.carLogic = carLogic;
    }

    animate(){
        this.moveForward();
    }

    moveForward(){
        if(this.carLogic != null){
            let dataForAnimation = this.carLogic.getDataToAnimate();
            let dirZ = dataForAnimation["direction"][2];
            let dirX = dataForAnimation["direction"][0];
            this.carModel.position.z +=  dirZ * dataForAnimation["velocity"];
            this.carModel.position.x += dirX * dataForAnimation["velocity"];
            let deltaRotation = dataForAnimation["lastRotationWheel"] - this.lastValueRotation;
            this.carModel.rotateY(-deltaRotation*MAX_CAR_ROTATION);
            this.lastValueRotation = dataForAnimation["lastRotationWheel"];
        }
    }

    getModel(){
        return this.carModel;
    }
}