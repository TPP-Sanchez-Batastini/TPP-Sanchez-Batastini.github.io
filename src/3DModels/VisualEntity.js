import { Vector3, LoadingManager } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Observer from "../ObserverPattern/Observer"

export default class VisualEntity extends Observer{

    constructor(pathToTexture){
        super();
        this.fbxLoader = new FBXLoader();
        this.gltfLoader = new GLTFLoader()
        this.threeDModel = null;
        this.pathToTexture = pathToTexture;
    }

    async loadFBX(){
        let pathToTexture = this.pathToTexture;
        const result = await this.fbxLoader.loadAsync( 
            pathToTexture, 
            function ( threeDObject ) {
                return threeDObject;
            }
        );
        return result;
        
    }

    async loadGLTF(){
        let pathToTexture = this.pathToTexture;
        const result = await this.gltfLoader.loadAsync( 
            pathToTexture, 
            function ( threeDObject ) {
                return threeDObject;
            }
        );
        return result;

    }

    async addToScene(scene, objectName, position, scale){
        if(!this.threeDModel){
            let modelVariable;
            try{
                modelVariable =  await this.loadFBX();
                this.threeDModel = modelVariable;
            }catch(e){
                modelVariable =  await this.loadGLTF();
                this.threeDModel = modelVariable.scene;
            }
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

    getModel(){
        return this.threeDModel;
    }

    //Abstract Method
    animate(){
        return null;
    }


}