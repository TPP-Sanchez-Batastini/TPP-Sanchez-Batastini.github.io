import CarEngine from './CarEngine';

const FRICTION_FACTOR = -0.1;

export default class Car{

    constructor(){
        this.carEngine = new CarEngine();
        this.currentVelocity = 0;
        this.currentDirection = [0,0,1];
    }

    accelerate(valueClutch, valueAccelerator){
        let engineAcceleration = this.carEngine.accelerate(valueClutch, valueAccelerator);
        let frictionAcceleration = this.currentVelocity * FRICTION_FACTOR;
        this.currentVelocity += engineAcceleration + frictionAcceleration;
        console.log("Velocidad: " + this.currentVelocity);
    }

    brake(valueClutch, valueBrake){
        let engineAcceleration = this.carEngine.brake(valueClutch, valueBrake);
        let frictionAcceleration = this.currentVelocity * FRICTION_FACTOR;
        this.currentVelocity += engineAcceleration + frictionAcceleration;
    }

    changeShift(valueClutch, newShift){
        this.carEngine.changeShift(valueClutch, newShift);
    }

    turnOnRightLight(){
        //PRENDER EL INTERMITENTE DERECHO
    }

    turnOnLeftLight(){
        //PRENDER EL INTERMITENTE DERECHO
    }

    turnOnCar(){
        this.carEngine.turnOn();
    }

    turnDirection(wheelAxesValue){
        //ROTAR LAS RUEDAS A IZQ O DERECHA Y DEFINIR EN LA ANIMACIÓN DE ALGUNA FORMA EL VALOR DE ESTE GIRO.
    }
}