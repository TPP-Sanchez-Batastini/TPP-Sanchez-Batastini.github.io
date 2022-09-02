import { EXPONENTIAL_COEF_TO_RPM, MAX_RPM } from "./CarEngineStates/AbstractEngineState";


const QUANTITY_SHIFTS = 6;
const MIN_VALUE_CLUTCH_TO_AVOID_SHUTDOWN = -0.75;

export default class ShiftBox{

    constructor(carEngine){
        this.NEUTRAL = 0;
        this.REVERSE = -1;
        this.FIRST = 1;
        this.SECOND = 2;
        this.THIRD = 3;
        this.FOURTH = 4;
        this.FIFTH = 5;
        this.SIXTH = 6;
        this.validShifts = [this.REVERSE, this.NEUTRAL, this.FIRST, this.SECOND, this.THIRD, this.FOURTH, this.FIFTH, this.SIXTH];

        this.currentShift = this.NEUTRAL;
        this.carEngine = carEngine;

        this.minimumVelocityOnShift = [0, 10, 20, 35, 60, 90];
        this.maximumVelocityOnShift = [40, 60, 80, 110, 140, 200];

    }

    isValidShift(shift){
        if (this.validShifts.indexOf(shift) >= 0){
            return true;
        }else{
            throw new Error("Shift " + shift + " is not valid.");
        }
    }
    

    calculateNormalFactorRPM(newShift,oldVelocity){
        return ((oldVelocity - this.minimumVelocityOnShift[Math.abs(newShift) - 1]) / 
            (this.maximumVelocityOnShift[Math.abs(newShift) - 1] - this.minimumVelocityOnShift[Math.abs(newShift) - 1]));
    }
    

    getValueForNewRPM(newShift, oldVelocity){
        if(newShift === this.NEUTRAL || (Math.abs(newShift) === this.FIRST && Math.abs(oldVelocity) < 5)){
            return this.carEngine.getCurrentRPM();
        }
        if(newShift === this.REVERSE && oldVelocity > 0){
            return 0;
        }
        if(newShift > 0 && oldVelocity < 0){
            return 0;
        }
        let normalFactorRPM = this.calculateNormalFactorRPM(newShift, oldVelocity);
        if ( normalFactorRPM > 1 ){
            return MAX_RPM;
        }else{
            let XValue = normalFactorRPM * EXPONENTIAL_COEF_TO_RPM;
            return (MAX_RPM * (1 - Math.exp(-XValue/EXPONENTIAL_COEF_TO_RPM)));
        }
    }
    

    clutchIsPressed(valueClutch){
        return valueClutch <= MIN_VALUE_CLUTCH_TO_AVOID_SHUTDOWN
    }


    shutDownEngine(){
        return false;
    }

    //CONSIDERAR EL VALUE DEL ACCELERATOR DE FORMA SIMILAR A COMO SE CONSIDERA EN ABSTRACT ENGINE STATE PARA QUE SI ES NEGATIVO DECREMENTE LA VELOCIDAD Y NO AUMENTE
    getEngineForce(currentVelocity, valueClutch){
        currentVelocity = Math.abs(currentVelocity);
        let currentRPM = this.carEngine.getCurrentRPM();

        if(this.currentShift === this.NEUTRAL){
            return 0;
        }

        let valueClutchNormalized = (valueClutch + 1)/2;
        let minVelocityBasedOnClutch = this.minimumVelocityOnShift[Math.abs(this.currentShift) - 1] * (1 - Math.exp(-valueClutchNormalized*3));
        //If there is a next shift and it has ideal velocity we can calculate the Normalized Engine Force based on velocity range

        let rangeOfVelocities = this.maximumVelocityOnShift[Math.abs(this.currentShift) - 1] - minVelocityBasedOnClutch;
        let normalFactorToDecrement = (currentVelocity - minVelocityBasedOnClutch) / rangeOfVelocities;
        if(currentVelocity < minVelocityBasedOnClutch){
            //Debería dar trompicones
        }
        let normalFactor = (1 - normalFactorToDecrement)**2;

        if(normalFactor > 1){
            normalFactor = 0;
        }

        let powerFactor = (QUANTITY_SHIFTS / this.currentShift);
        let finalEngineForce =  powerFactor * currentRPM * normalFactor;
        return finalEngineForce

    }

    changeShift(){
        //METHOD TO OVERRIDE
    }


    getCurrentShift(){
        return this.currentShift;
    }

}