import * as THREE from 'three';
import VisualEntity from "./VisualEntity";

export default class Intersection extends VisualEntity{
    constructor(pathToTexture){
        super(pathToTexture);
        this.pathToTexture = pathToTexture;
        this.pathToNormalMap = "textures/pavimento_map.png"
        this.SIZE = 30;
        this.SIDEWALK_HEIGHT = .4;
        this.SQUARE_SIZE = 7*30/24 + 0.12;
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


    getLerpPoints(vec1, vec2, quantPoints){
        const points = [];
        for (let i=0; i<=quantPoints; i++){
            points.push(new THREE.Vector3(
                vec1.x + (vec2.x - vec1.x) * i/quantPoints,
                vec1.y + (vec2.y - vec1.y) * i/quantPoints,
                vec1.z + (vec2.z - vec1.z) * i/quantPoints,
            ))
        }
        return points;
    }

    createSidewalkCurve(){
        let initialPoint = new THREE.Vector3(-this.SQUARE_SIZE/2,0,-this.SQUARE_SIZE/2);
        const lerpPoints = this.getLerpPoints(initialPoint, new THREE.Vector3(-this.SQUARE_SIZE/2,0,this.SQUARE_SIZE/10), 5);
        const curve = new THREE.QuadraticBezierCurve(
            new THREE.Vector2(-this.SQUARE_SIZE/2,this.SQUARE_SIZE/10),
            new THREE.Vector2(-this.SQUARE_SIZE/2,this.SQUARE_SIZE/2),
            new THREE.Vector2(-this.SQUARE_SIZE/10,this.SQUARE_SIZE/2)
        );
        const pointsCurve = curve.getPoints(10);
        for (let i=0; i<pointsCurve.length; i++){
            pointsCurve[i] = new THREE.Vector3(pointsCurve[i].x, 0, pointsCurve[i].y);
        }
        const secondLerpPoints = this.getLerpPoints(new THREE.Vector3(-this.SQUARE_SIZE/10,0,this.SQUARE_SIZE/2), new THREE.Vector3(this.SQUARE_SIZE/2,0,this.SQUARE_SIZE/2), 5);
        const thirdLerpPoints = this.getLerpPoints(new THREE.Vector3(this.SQUARE_SIZE/2,0,this.SQUARE_SIZE/2), new THREE.Vector3(this.SQUARE_SIZE/2,0,-this.SQUARE_SIZE/2), 5);
        const fourthLerpPoints = this.getLerpPoints(new THREE.Vector3(this.SQUARE_SIZE/2,0,-this.SQUARE_SIZE/2), new THREE.Vector3(-this.SQUARE_SIZE/2,0,-this.SQUARE_SIZE/2), 5);
        return [
            ...lerpPoints, 
            ...pointsCurve, 
            ...secondLerpPoints, 
            ...thirdLerpPoints, 
            ...fourthLerpPoints
        ];
    }


    getGeometrySidewalk(){
        const geom = new THREE.BufferGeometry();
        const points = this.createSidewalkCurve();
        const columnas = points.length;
        const filas = 4; //Fila baja, fila alta, tapa alta
        const aux_vertices = [[],[],[]];
        const indexes = [];
        const uv1 = [];
        const uv2 = [];
        const uv3 = [];
        let accum_x = 0;
        let accum_z = 0;
        for (let i=0; i<points.length; i++){
            accum_x += points[i].x;
            accum_z += points[i].z;
        }
        
        for (let i=0; i<points.length; i++){
            aux_vertices[0].push(points[i].x, points[i].y, points[i].z);
            aux_vertices[1].push(points[i].x, this.SIDEWALK_HEIGHT, points[i].z);
            aux_vertices[2].push(accum_x/points.length, this.SIDEWALK_HEIGHT, accum_z/points.length);            
            // Los uvs se calculan como la posicion del punto en la tapa (X,Z)
            // Normalizar para el UV con +this.SQUARE_SIZE/2 / this.SQUARE_SIZE.
            //uv1.push((points[i].x+this.SQUARE_SIZE/2)/this.SQUARE_SIZE, (points[i].z+this.SQUARE_SIZE/2)/this.SQUARE_SIZE);
            uv1.push(0.03414,0);
            uv2.push((points[i].x+this.SQUARE_SIZE/2)/this.SQUARE_SIZE, (points[i].z+this.SQUARE_SIZE/2)/this.SQUARE_SIZE);
            uv3.push(((accum_x/points.length)+this.SQUARE_SIZE/2)/this.SQUARE_SIZE, ((accum_z/points.length)+this.SQUARE_SIZE/2)/this.SQUARE_SIZE);
        }
        const uv = [...uv1, ...uv1, ...uv2, ...uv3];
        const vertex = [...aux_vertices[0], ...aux_vertices[1], ...aux_vertices[1], ...aux_vertices[2]];
        for (let i=0; i < filas-1; i++) {
            for (let j=1; j < columnas; j++) {
                //1er triangulo
                indexes.push(i*columnas+j-1);
                indexes.push((i+1)*columnas+j-1);
                indexes.push(i*columnas+j);
                //2do triangulo
                indexes.push(i*columnas+j);
                indexes.push((i+1)*columnas+j-1);
                indexes.push((i+1)*columnas+j);

            }
        }
        const vertexArr = new Float32Array(vertex);
        const uvArr = new Float32Array(uv);
        geom.setIndex(indexes);
        geom.setAttribute("position", new THREE.BufferAttribute(vertexArr, 3));
        geom.setAttribute("uv", new THREE.BufferAttribute(uvArr, 2));
        geom.computeVertexNormals();
        return geom;
    }


    createSidewalkMesh(){
        const texture = new THREE.TextureLoader().load("textures/pavimento.jpg");
        texture.repeat.set( 3, 3 );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const materialSidewalk = new THREE.MeshPhongMaterial( {map: texture,  side: THREE.DoubleSide} );
        const geometrySidewalk = this.getGeometrySidewalk();
        const mesh = new THREE.Mesh( geometrySidewalk, materialSidewalk );
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        return mesh;
    }

    createStreetMesh(){
        const geometry = new THREE.BoxGeometry( this.SIZE, 0.1, this.SIZE );
        const texture = new THREE.TextureLoader().load(this.pathToTexture);
        texture.repeat.set( 1, 1 );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const material = new THREE.MeshPhongMaterial( {map: texture,  side: THREE.DoubleSide} );
        const mesh = new THREE.Mesh( geometry, material );
        mesh.receiveShadow = true;
        return mesh;
    }


    async addToScene(scene, objectName, position){
        if(!this.threeDModel){
            const baseStreet = this.createStreetMesh();
            baseStreet.position.set(0,0,0);
            this.threeDModel = new THREE.Group();
            this.threeDModel.add(baseStreet);
            for (let i=0; i<4; i++){
                const sidewalk = this.createSidewalkMesh();
                if (i===0){
                    sidewalk.position.set(-this.SIZE/2+this.SQUARE_SIZE/2,0,-this.SIZE/2+this.SQUARE_SIZE/2);
                    sidewalk.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI/2);
                }else if(i===2){
                    sidewalk.position.set(-this.SIZE/2+this.SQUARE_SIZE/2,0,this.SIZE/2-this.SQUARE_SIZE/2);
                    sidewalk.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI);
                }else if(i===3){
                    sidewalk.position.set(this.SIZE/2-this.SQUARE_SIZE/2,0,-this.SIZE/2+this.SQUARE_SIZE/2);
                }else{
                    sidewalk.position.set(this.SIZE/2-this.SQUARE_SIZE/2,0,this.SIZE/2-this.SQUARE_SIZE/2);
                    sidewalk.rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI/2);
                }
                sidewalk.updateMatrix();
                sidewalk.updateMatrixWorld();
                sidewalk.matrixAutoUpdate = false;
                this.threeDModel.add(sidewalk);
            }
            this.threeDModel.name = objectName;
            this.threeDModel.receiveShadow = true;
            this.threeDModel.position.set(position[0], position[1], position[2]);
            baseStreet.updateMatrix();
            baseStreet.updateMatrixWorld();
            baseStreet.matrixAutoUpdate = false;
            this.threeDModel.updateMatrix();
            this.threeDModel.updateMatrixWorld();
            this.threeDModel.matrixAutoUpdate = false;
            scene.add(this.threeDModel);
        }
        return this;
    }

}