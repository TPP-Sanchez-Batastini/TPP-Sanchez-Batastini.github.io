import * as THREE from 'three';
import VisualEntity from "./VisualEntity";

export default class Intersection extends VisualEntity{
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
        let initialPoint = new THREE.Vector3(-5,0,-5);
        const lerpPoints = this.getLerpPoints(initialPoint, new THREE.Vector3(-5,0,1), 5);
        const curve = new THREE.QuadraticBezierCurve(
            new THREE.Vector2(-5,1),
            new THREE.Vector2(-5,5),
            new THREE.Vector2(-1,5)
        );
        const pointsCurve = curve.getPoints(10);
        for (let i=0; i<pointsCurve.length; i++){
            pointsCurve[i] = new THREE.Vector3(pointsCurve[i].x, 0, pointsCurve[i].y);
        }
        const secondLerpPoints = this.getLerpPoints(new THREE.Vector3(-1,0,5), new THREE.Vector3(5,0,5), 5);
        const thirdLerpPoints = this.getLerpPoints(new THREE.Vector3(5,0,5), new THREE.Vector3(5,0,-5), 5);
        const fourthLerpPoints = this.getLerpPoints(new THREE.Vector3(5,0,-5), new THREE.Vector3(-5,0,-5), 5);
        return [
            initialPoint, 
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
        const filas = 3; //Fila baja, fila alta, tapa alta
        const aux_vertices = [[],[],[]];
        const indexes = [];
        for (let i=0; i<points.length; i++){
            aux_vertices[0].push(points[i].x, points[i].y, points[i].z);
            aux_vertices[1].push(points[i].x, this.SIDEWALK_HEIGHT, points[i].z);
            aux_vertices[2].push(5, this.SIDEWALK_HEIGHT, 5);
        }
        const vertex = [...aux_vertices[0], ...aux_vertices[1], ...aux_vertices[2]];
        for (let i=0; i < filas-1; i++) {
            for (let j=1; j < columnas; j++) {
                //1er triangulo
                indexes.push(i*columnas+j-1);
                indexes.push((i+1)*columnas+j-1);
                indexes.push(i*columnas+j);
                //2do triangulo
                indexes.push((i+1)*columnas+j-1);
                indexes.push(i*columnas+j);
                indexes.push((i+1)*columnas+j);
                if ((i*columnas + j) % columnas === 0 && (j !== 0) && (i*columnas+j) !== (filas*columnas-1)){
                    indexes.push((i+1)*columnas+j);
                    indexes.push((i+1)*columnas);
                }
            }
        }
        console.log(indexes);
        const vertexArr = new Float32Array(vertex);
        geom.setIndex(indexes);
        geom.setAttribute("position", new THREE.BufferAttribute(vertexArr, 3));
        return geom;
    }


    createSidewalkMesh(){
        //const texture = new THREE.TextureLoader().load("textures/cone.png");
        //let normalTexture = new THREE.TextureLoader().load(
        //    this.pathToNormalMap
        //);
        //const materialSidewalk = new THREE.MeshStandardMaterial( {map: texture,  side: THREE.DoubleSide} );
        const materialSidewalk = new THREE.MeshBasicMaterial({color:0xefefef, side: THREE.DoubleSide});
        //materialSidewalk.normalMap = normalTexture;
        const geometrySidewalk = this.getGeometrySidewalk();

        return new THREE.Mesh( geometrySidewalk, materialSidewalk );
    }

    createStreetMesh(){
        const geometry = new THREE.BoxGeometry( this.SIZE, 0.1, this.SIZE );
        const texture = new THREE.TextureLoader().load(this.pathToTexture);
        let normalTexture = new THREE.TextureLoader().load(
            this.pathToNormalMap
        );
        const material = new THREE.MeshStandardMaterial( {map: texture,  side: THREE.DoubleSide} );
        material.normalMap = normalTexture;
        return new THREE.Mesh( geometry, material );
    }


    async addToScene(scene, objectName, position){
        if(!this.threeDModel){
            const baseStreet = this.createStreetMesh();
            baseStreet.position.set(0,0,0);
            this.threeDModel = new THREE.Group();
            this.threeDModel.add(baseStreet);
            for (let i=0; i<4; i++){
                const sidewalk = this.createSidewalkMesh();
                if (i==0){
                    sidewalk.position.set(-this.SIZE/2+5,1,-this.SIZE/2+5);
                    sidewalk.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI/2);
                }else if(i==2){
                    sidewalk.position.set(-this.SIZE/2+5,1,this.SIZE/2-5);
                    sidewalk.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI);
                }else if(i==3){
                    sidewalk.position.set(this.SIZE/2-5,1,-this.SIZE/2+5);
                }else{
                    sidewalk.position.set(this.SIZE/2-5,1,this.SIZE/2-5);
                    sidewalk.rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI/2);
                }
                sidewalk.updateMatrix();
                sidewalk.updateMatrixWorld();
                sidewalk.matrixAutoUpdate = false;
                this.threeDModel.add(sidewalk);
            }
            this.threeDModel.name = objectName;
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