import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class ModelsSingleton{

    constructor(){
        this.gltfLoader = new GLTFLoader();
        this.carModel = null;
        this.building_1 = null;
        this.building_2 = null;
        this.building_3 = null;
        this.building_4 = null;
    }

    async loadGLTF(pathToTextureRcvd){
        let pathToTexture = pathToTextureRcvd;
        const result = await this.gltfLoader.loadAsync( 
            pathToTexture, 
            function ( threeDObject ) {
                return threeDObject;
            }
        );
        return result.scene;
    }

    async loadModels(){
        this.carModel = this.loadGLTF('res/models/source/AutoConInterior.glb');
        this.building_1 = this.loadGLTF('res/models/source/buildings/Building_1.glb');
        this.building_2 = this.loadGLTF('res/models/source/buildings/Building_2.glb');
        this.building_3 = this.loadGLTF('res/models/source/buildings/Building_3.glb');
        this.building_4 = this.loadGLTF('res/models/source/buildings/Building_4.glb');
        return "OK";
    }

    
}

export default class Models{

    static ModelsSingleton

    static async getInstance(){
        if (!Models.ModelsSingleton){
            Models.ModelsSingleton = new ModelsSingleton();
            let res = await Models.ModelsSingleton.loadModels();
            if (res === "OK"){
                return Models.ModelsSingleton;
            }else{
                throw new Error("Error al cargar los modelos.");
            }
        }else{
            return Models.ModelsSingleton;
        }
        
    }
}