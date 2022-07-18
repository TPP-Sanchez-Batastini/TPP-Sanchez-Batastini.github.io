import {AbstractEngineState} from "./AbstractEngineState";

const ACCEL_NOT_PRESSED = 1.0;

export default class TurnedOffEngine extends AbstractEngineState{

    accelerate(valueAccelerator, currentRPM, currentXInRPMCurve){
        //return this.changeValueInRPMCurve(ACCEL_NOT_PRESSED, true, currentRPM, currentXInRPMCurve);
        throw new Error("Not Turned On Engine can not accelerate");
    }

    brake(valueBrake, currentRPM, currentXInRPMCurve){
        return this.changeValueInRPMCurve(valueBrake, false, currentRPM, currentXInRPMCurve);
    }
}