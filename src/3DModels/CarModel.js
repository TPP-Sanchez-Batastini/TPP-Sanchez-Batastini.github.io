import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const SCALE = [0.01, 0.01, 0.01];
const POSITION = [0,0,0];

export default class CarModel{
    
    constructor(){
        this.fbxLoader = new FBXLoader();
        this.carModel = null;
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
            this.carModel.position.y = POSITION[0];
            this.carModel.position.z = POSITION[0];
            this.carModel.scale.x = SCALE[0];
            this.carModel.scale.y = SCALE[0];
            this.carModel.scale.z = SCALE[0];
            console.log(this.carModel);
            scene.add(this.carModel);
            return this;
        }
    }

    animate(){
        this.moveForward(0.01);
    }

    moveForward(unitsMovement){
        this.carModel.position.z += unitsMovement;
    }
}