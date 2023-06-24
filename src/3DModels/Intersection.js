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
        let initialPoint = new THREE.Vector3(0,0,0);
        const lerpPoints = this.getLerpPoints(initialPoint, new THREE.Vector3(0,0,6), 5);
        const curve = new THREE.QuadraticBezierCurve(
            new THREE.Vector2(0,6),
            new THREE.Vector2(0,10),
            new THREE.Vector2(4,10)
        );
        const pointsCurve = curve.getPoints(10);
        for (let i=0; i<pointsCurve.length; i++){
            pointsCurve[i] = new THREE.Vector3(pointsCurve[i].x, 0, pointsCurve[i].y);
        }
        const secondLerpPoints = this.getLerpPoints(new THREE.Vector3(4,0,10), new THREE.Vector3(10,0,10), 5);
        const thirdLerpPoints = this.getLerpPoints(new THREE.Vector3(10,0,10), new THREE.Vector3(10,0,0), 5);
        const fourthLerpPoints = this.getLerpPoints(new THREE.Vector3(10,0,0), new THREE.Vector3(0,0,0), 5);
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
        const vertices = [];
        const indexes = [];
        for (let i=0; i<points.length; i++){
            vertices.push(
                points[i].x, points[i].y, points[i].z,
                points[i].x, points[i].y+this.SIDEWALK_HEIGHT, points[i].z
            );
        }
        //REVISAR ESTOS VERTICES
        vertices.push(new THREE.Vector3(5,this.SIDEWALK_HEIGHT,5));
        for (let i=0; i<points.length*4-3; i++){
            indexes.push(i, i+1, i+2);
        }
        //REVISAR ESTOS INDICES
        for (let i=0; i<points.length-3; i++){
            indexes.push(i*2+1,vertices.length%3-1,i*2+3);
        }
        const vertexArr = new Float32Array(vertices);
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
        const materialSidewalk = new THREE.MeshBasicMaterial({color:"#ff0000", side: THREE.DoubleSide});
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
            const sidewalks = [];
            for (let i=0; i<4; i++){
                const sidewalk = this.createSidewalkMesh();
                sidewalk.position.set(30*i%2,1,30*i%2);
                sidewalk.updateMatrix();
                sidewalk.updateMatrixWorld();
                sidewalk.matrixAutoUpdate = false;
                sidewalks.push(sidewalk);
            }
            
            baseStreet.position.set(0,0,0);
            this.threeDModel = new THREE.Group();
            this.threeDModel.add(baseStreet);
            sidewalks.forEach(sidewalk => this.threeDModel.add(sidewalk));
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