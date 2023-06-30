import GeneralPhysics from "./GeneralPhysics";
import AmmoInstance from "../AmmoInstance";
export default class CustomGeometryPhysics extends GeneralPhysics{
    async generateShape(){
        let Ammo = await AmmoInstance.getInstance();
        let _triangle, triangle_mesh = new Ammo.btTriangleMesh();
        //declare triangles position vectors
        let vectA = new Ammo.btVector3(0, 0, 0);
        let vectB = new Ammo.btVector3(0, 0, 0);
        let vectC = new Ammo.btVector3(0, 0, 0);
        //retrieve vertices positions from object
        let verticesPos = this.shape.getAttribute('position').array;
        let triangles = [];
        for (let i = 0; i < verticesPos.length; i += 3) {
            triangles.push({
                x: verticesPos[i],
                y: verticesPos[i + 1],
                z: verticesPos[i + 2]
            });
        }
        //use triangles data to draw ammo shape
        for (let i = 0; i < triangles.length - 3; i += 3) {

            vectA.setX(triangles[i].x);
            vectA.setY(triangles[i].y);
            vectA.setZ(triangles[i].z);

            vectB.setX(triangles[i + 1].x);
            vectB.setY(triangles[i + 1].y);
            vectB.setZ(triangles[i + 1].z);

            vectC.setX(triangles[i + 2].x);
            vectC.setY(triangles[i + 2].y);
            vectC.setZ(triangles[i + 2].z);

            triangle_mesh.addTriangle(vectA, vectB, vectC, true);
        }
        Ammo.destroy(vectA);
        Ammo.destroy(vectB);
        Ammo.destroy(vectC);

        var shape = new Ammo.btBvhTriangleMeshShape(triangle_mesh, true);
        shape.setMargin(0);
        return shape;
    }
}