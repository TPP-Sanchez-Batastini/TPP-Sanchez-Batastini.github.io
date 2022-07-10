import {AbstractEngineState} from "./AbstractEngineState";

export default class TurnedOffEngine extends AbstractEngineState{

    accelerate(valueAccelerator, currentRPM, currentXInRPMCurve){
        throw new Error("Not Turned On Engine can not accelerate");
    }

    brake(valueBrake, currentRPM, currentXInRPMCurve){
        return this.changeValueInRPMCurve(valueBrake, false, currentRPM, currentXInRPMCurve);
    }
}