import {AbstractEngineState} from "./AbstractEngineState";

export default class TurnedOnEngine extends AbstractEngineState{

    accelerate(valueAccelerator, currentRPM, currentXInRPMCurve){
        return this.changeValueInRPMCurve(valueAccelerator, true, currentRPM, currentXInRPMCurve);
    }

    brake(valueBrake, currentRPM, currentXInRPMCurve){
        return this.changeValueInRPMCurve(valueBrake, false, currentRPM, currentXInRPMCurve);
    }

}