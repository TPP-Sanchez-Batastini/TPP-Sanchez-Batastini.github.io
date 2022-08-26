

const QUANTITY_SHIFTS = 6;
const MIN_VALUE_CLUTCH_TO_AVOID_SHUTDOWN = 0.25;

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
        this.idealVelocityOnShift = [0, 13, 30, 60, 90, 120, 130];
    }

    isValidShift(shift){
        if (this.validShifts.indexOf(shift) >= 0){
            return true;
        }else{
            throw new Error("Shift " + shift + " is not valid.");
        }
    }
    
    getValueForNewRPM(newShift, oldVelocity){
        let differenceInVelocityAndIdeal =  this.idealVelocityOnShift[newShift] - oldVelocity;
        let newRPM;
        if(differenceInVelocityAndIdeal > 0){
            newRPM = this.carEngine.getCurrentRPM() - differenceInVelocityAndIdeal**2
        }else{
            newRPM = this.carEngine.getCurrentRPM() + differenceInVelocityAndIdeal**2
        }
        return newRPM;
    }
    

    clutchIsPressed(valueClutch){
        return valueClutch <= MIN_VALUE_CLUTCH_TO_AVOID_SHUTDOWN
    }


    //CONSIDERAR EL VALUE DEL ACCELERATOR DE FORMA SIMILAR A COMO SE CONSIDERA EN ABSTRACT ENGINE STATE PARA QUE SI ES NEGATIVO DECREMENTE LA VELOCIDAD Y NO AUMENTE
    getEngineForce(currentVelocity){
        currentVelocity = Math.abs(currentVelocity);
        let currentRPM = this.carEngine.getCurrentRPM();

        if(this.currentShift === this.NEUTRAL){
            return 0;
        }
        //If there is a next shift and it has ideal velocity we can calculate the Normalized Engine Force based on velocity range
        let idealVelocityOnShift = this.idealVelocityOnShift[Math.abs(this.currentShift) - 1];
        let idealVelocityOnNextShift = this.idealVelocityOnShift[Math.abs(this.currentShift)];
        let rangeOfVelocities = idealVelocityOnNextShift * 2 - idealVelocityOnShift;
        let normalFactorToDecrement = (currentVelocity - idealVelocityOnShift) / rangeOfVelocities;
        if(normalFactorToDecrement < 0){
            //Debería dar trompicones
        }
        let normalFactor = (1 - normalFactorToDecrement)**2;

        if(normalFactor > 1){
            normalFactor = 0;
        }

        let sign = this.currentShift === this.REVERSE ? -1 : 1;
        return sign * currentRPM * normalFactor;
    }

    changeShift(){
        //METHOD TO OVERRIDE
    }

}