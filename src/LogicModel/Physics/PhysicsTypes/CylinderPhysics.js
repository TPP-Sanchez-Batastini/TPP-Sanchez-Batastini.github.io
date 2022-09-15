import AmmoInstance from "../AmmoInstance";
import GeneralPhysics from "./GeneralPhysics";

export default class CylinderPhysics extends GeneralPhysics{
    
    // Shape is a Vector3(Radius, HeightCylinder/2, Radius). 
    // See: https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=5889
    // It's origin is in the center of the cylinder so calculate position by using height/2.

    async generateShape(){
        let Ammo = await AmmoInstance.getInstance();
        return new Ammo.btCylinderShape(new Ammo.btVector3(this.shape.x, this.shape.y, this.shape.z));
    }
}