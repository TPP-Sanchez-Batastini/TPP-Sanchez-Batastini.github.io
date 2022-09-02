import {AbstractEngineState} from "./AbstractEngineState";

const ACCEL_NOT_PRESSED = 0;

export default class TurnedOffEngine extends AbstractEngineState{

    accelerate(valueAccelerator, currentRPM, currentXInRPMCurve){
        return this.changeValueInRPMCurve(ACCEL_NOT_PRESSED, true, currentRPM, currentXInRPMCurve);
    }

    brake(valueBrake, currentRPM, currentXInRPMCurve){
        return this.changeValueInRPMCurve(valueBrake, false, currentRPM, currentXInRPMCurve);
    }
}