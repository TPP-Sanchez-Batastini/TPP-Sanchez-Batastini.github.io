import { Vector3 } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import VisualEntity from './VisualEntity';

const SCALE = [0.01, 0.01, 0.01];
const POSITION = [0,4,0];
const MAX_CAR_ROTATION = 0.7; //In rads.

export default class CarModel extends VisualEntity{
    
    constructor(){
        super('res/models/source/carModel.fbx');
        this.carModel = null;
        this.carLogic = null;
        this.lastValueRotation = 0;
    }

    async addToScene(scene){
        await super.addToScene(scene, "driverCar", POSITION, SCALE);
        return this;
    }

    animate(){
        this.moveForward();
    }

    moveForward(){
        if(this.observedState != null){
            this.threeDModel.position.x = this.observedState["position"].x;
            this.threeDModel.position.y = this.observedState["position"].y;
            this.threeDModel.position.z = this.observedState["position"].z;

            //TODO: Have to modify
            let deltaRotation = this.observedState["lastRotationWheel"] - this.lastValueRotation;
            this.threeDModel.rotateY(-deltaRotation*MAX_CAR_ROTATION);
            this.lastValueRotation = this.observedState["lastRotationWheel"];
        }
    }
}