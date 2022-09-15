import GeneralPhysics from "./GeneralPhysics";
import AmmoInstance from "../AmmoInstance";
export default class BoxPhysics extends GeneralPhysics{


    async generateShape(){
        let Ammo = await AmmoInstance.getInstance();
        return new Ammo.btBoxShape(new Ammo.btVector3(this.shape.x/2, this.shape.y/2, this.shape.z/2));
    }
}