import CarModel from "../../3DModels/CarModel";
import Observer from "../../ObserverPattern/Observer";
import Car from "../CarLogic/Car.js";

const CLUTCH_PRESSED = 0;
const CLUTCH_NOT_PRESSED = 1;


export default class TrafficModel extends Observer {

    constructor(scene, physicsWorld, streets){
        super();
        this.SIZE_OF_TRAFFIC = 2;
        this.timeSinceLastUpdate = Date.now();
        this.trafficWorker = new Worker("./workers/TrafficWorker.js");
        this.currentTraffic = {};
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.levelStreets = streets;
        this.lastID = 0;
        
        this.trafficWorker.onmessage = (message) => {
            this.onReceiveResponseFromWorker(message);
        }
    }

    async onReceiveResponseFromWorker(message){
        this.updateCarEngines(message.data);
    }


    async onCollideWithCarOfTraffic () {
        console.log("CHOCASTE AL AUTO");
    }


    async generateCar(){
        
        let carLogic = new Car(this.physicsWorld, [18 ,2,15 + this.lastID * 5], false);
        await carLogic.carPhysics.buildAmmoPhysics(); 
        
        let carModel = new CarModel();
        await carModel.addToScene(this.scene, `traffic_car_${this.lastID}`, false);

        carLogic.carPhysics.rigidBody.threeObject = carModel;
        carLogic.carPhysics.rigidBody.onCollide = this.onCollideWithCarOfTraffic;

        carLogic.attachObserver(carModel);
        carLogic.notifyObservers();
        
        this.currentTraffic[this.lastID] = {
            object3D: carModel,
            engine: carLogic
        };
        this.lastID += 1;
        return carModel;
    }


    deleteCar(carId){
        this.currentTraffic[carId].engine.removeObserver(this.currentTraffic[carId].object3D);
        this.physicsWorld.removeRigidBody( this.currentTraffic[carId].engine.carPhysics.rigidyBody );
        this.physicsWorld.removeCollisionObject( this.currentTraffic[carId].engine.carPhysics.rigidyBody );
        this.scene.remove( this.currentTraffic[carId].object3D.threeDModel );
        delete this.currentTraffic[carId];
    }


    async generateInitialTraffic(){
        const objectsInTraffic = [];
        for (let i=0; i<this.SIZE_OF_TRAFFIC; i++){
            objectsInTraffic.push(await this.generateCar());
        }
        return objectsInTraffic;
    }

    updateTraffic(){
        const trafficCars = [];
        Object.entries(this.currentTraffic).forEach(entry => {
            const [carId, value] = entry;
            const carData = value.engine.getDataToAnimate();
            carData.carId = carId;
            delete carData.physicsBody;
            delete carData.wheelsData;
            trafficCars.push(carData);
        });
        if (this.observedState){
            delete this.observedState.physicsBody;
            delete this.observedState.wheelsData;
        }
        this.trafficWorker.postMessage({
            playersCar: this.observedState,
            streets: this.levelStreets,
            trafficCars
        });
    }


    /* carActions trae un object que tiene de key carId, y de value:
        * deleteCar: boolean -> define si desinstancia el auto o no
        * accelerate: float entre 0 y 1 -> define si acelera o no el auto
        * brake: float entre 0 y 1 -> define si frena o no el auto
        * steering: float entre -1 y 1 -> define la rotacion del volante
    */ 
    updateCarEngines(carActions){
        Object.keys(carActions).forEach(carId => {
            if (carActions[carId].deleteCar){
                this.deleteCar(carId);
            }else{
                this.currentTraffic[carId].engine.turnOnCar();
                this.currentTraffic[carId].engine.turnDirection(carActions[carId].steering);
                this.currentTraffic[carId].engine.changeShift(CLUTCH_PRESSED, 1);
                this.currentTraffic[carId].engine.accelerate(CLUTCH_NOT_PRESSED, carActions[carId].accelerate);  
                this.currentTraffic[carId].engine.brake(CLUTCH_PRESSED, carActions[carId].brake);
                this.currentTraffic[carId].engine.update();
            }
        });
    }


    animate(){
        this.updateTraffic();
        Object.values(this.currentTraffic).forEach(carObject => {
            carObject.object3D.animate();
        });
    }
}