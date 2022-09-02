import Car from '../CarLogic/Car';

const NEUTRAL = 0;
const FIRST_SHIFT = 1;
const SECOND_SHIFT = 2;
const THIRD_SHIFT = 3;
const FOURTH_SHIFT = 4;
const FIFTH_SHIFT = 5;
const SIXTH_SHIFT = 6;
const REVERSE_SHIFT = -1;

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