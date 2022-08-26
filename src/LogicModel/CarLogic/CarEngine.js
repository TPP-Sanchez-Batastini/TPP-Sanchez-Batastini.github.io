import TurnedOffEngine from './CarEngineStates/TurnedOffEngine';
import TurnedOnEngine from './CarEngineStates/TurnedOnEngine';

const MIN_RPM_TO_AVOID_SHUTDOWN = 0;//1000
const MIN_VALUE_CLUTCH_TO_AVOID_SHUTDOWN = 0.25;

export default class CarEngine{


    constructor(){
        this.engineState = new TurnedOffEngine();
        this.currentRPM = 0;
        this.currentXInRPMCurve = 0;
    }


    turnOn(){
        this.engineState = new TurnedOnEngine();
    }


    clutchIsPressed(valueClutch){
        return valueClutch <= MIN_VALUE_CLUTCH_TO_AVOID_SHUTDOWN
    }


    handleEngineShutdown(valueClutch,shiftBox){
        //!this.clutchIsPressed(valueClutch) && this.currentRPM < MIN_RPM_TO_AVOID_SHUTDOWN
        if(shiftBox.shutDownEngine(valueClutch,this.currentRPM)){
            if(this.engineState instanceof TurnedOnEngine){
                this.engineState = new TurnedOffEngine();
            }
            
        }
    }


    isInConditionToAccelerate(valueClutch){
        return ((this.currentRPM >= MIN_RPM_TO_AVOID_SHUTDOWN && !this.clutchIsPressed(valueClutch)) || this.clutchIsPressed(valueClutch));
    }


    engineCanApplyForce(valueClutch){
        return (this.currentRPM >= MIN_RPM_TO_AVOID_SHUTDOWN && !this.clutchIsPressed(valueClutch));
    }


    accelerate(valueClutch, valueAccelerator, shiftBox){
        let rpmReturn = this.engineState.accelerate(valueAccelerator, this.currentRPM, this.currentXInRPMCurve);
        this.currentRPM = rpmReturn[0];
        this.currentXInRPMCurve = rpmReturn[1];
        this.handleEngineShutdown(valueClutch,shiftBox);
    }


    brake(valueClutch, valueBrake,shiftBox){
        let rpmReturn = this.engineState.brake(valueBrake, this.currentRPM, this.currentXInRPMCurve);
        this.currentRPM = rpmReturn[0];
        this.currentXInRPMCurve = rpmReturn[1];
        this.handleEngineShutdown(valueClutch,shiftBox);
    }


    changeRPM(RPMModification){
        this.currentRPM += RPMModification;
    }


    getCurrentRPM(){
        return this.currentRPM;
    }
}