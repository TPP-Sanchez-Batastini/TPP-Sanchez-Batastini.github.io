export default class GlobalControllerHandling{

    
    constructor(car){
        this.car = car;
    }


    handleAccelerate(valueClutch, valueAccelerator){
        this.car.accelerate(valueClutch, valueAccelerator);
    }


    handleBrake(valueClutch, valueBrake){
        this.car.brake(valueClutch, valueBrake);
    }


    changeShift(valueClutch, valueShift){
        this.car.changeShift(valueClutch, valueShift);
    }


    turnDirection(wheelAxesValue){
        this.car.turnDirection(wheelAxesValue);
    }


    turnOnCar(){
        this.car.turnOnCar();
    }


    updateCar(){
        this.car.update();
    }


    changeShiftBox(mode){
        this.car.changeShiftBox(mode);
    }
}