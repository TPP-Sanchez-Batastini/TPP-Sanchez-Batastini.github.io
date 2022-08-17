export const MAX_RPM = 6000;
const ACCEL_COEF = 1;
const BRAKE_COEF = 2;
const EXPONENTIAL_COEF_TO_RPM = 200;

export class AbstractEngineState{
    changeValueInRPMCurve(valueAccelerator, accelerating, currentRPM, currentXInRPMCurve){

        let sumToValueInCurve;
        if(accelerating){
            sumToValueInCurve = (valueAccelerator * -1 + 0.8) * ACCEL_COEF;
        }else{
            sumToValueInCurve = (valueAccelerator - 1) * BRAKE_COEF;
        }
        currentXInRPMCurve = currentXInRPMCurve + sumToValueInCurve;
        if (currentXInRPMCurve > 3 * EXPONENTIAL_COEF_TO_RPM){
            currentXInRPMCurve = 3 * EXPONENTIAL_COEF_TO_RPM;
        }
        else if(currentXInRPMCurve < 0){ //X's value is not able to have negative value in our calculation.
            currentXInRPMCurve = 0;
        }
        //We'll simulate the RPM's in an equation similar to capacitors in order to not make it linear and make it independent of everything.
        currentRPM = MAX_RPM * (1 - Math.exp(-currentXInRPMCurve/EXPONENTIAL_COEF_TO_RPM));

        return [currentRPM, currentXInRPMCurve];
    }
}