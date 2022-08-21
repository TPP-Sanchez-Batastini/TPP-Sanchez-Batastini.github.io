import TurnedOffEngine from './CarEngineStates/TurnedOffEngine';
import TurnedOnEngine from './CarEngineStates/TurnedOnEngine';

const MIN_RPM_TO_AVOID_SHUTDOWN = 1000;
const MIN_VALUE_CLUTCH_TO_AVOID_SHUTDOWN = 0.25;
const NEUTRAL = 0;
const REVERSE = -1;

export default class CarEngine{


    constructor(){
        this.engineState = new TurnedOffEngine();
        this.currentRPM = 0;
        this.currentXInRPMCurve = 0;
        this.currentShift = NEUTRAL;
    }


    turnOn(){
        this.engineState = new TurnedOnEngine();
        console.log("Engine Started");
    }


    clutchIsPressed(valueClutch){
        return valueClutch <= MIN_VALUE_CLUTCH_TO_AVOID_SHUTDOWN
    }


    handleEngineShutdown(valueClutch){
        if(!this.clutchIsPressed(valueClutch) && this.currentRPM < MIN_RPM_TO_AVOID_SHUTDOWN){
            if(this.engineState instanceof TurnedOnEngine){
                this.engineState = new TurnedOffEngine();
                console.log("Engine Shutdown");
            }
            
        }
    }


    isInConditionToAccelerate(valueClutch){
        return ((this.currentRPM >= MIN_RPM_TO_AVOID_SHUTDOWN && !this.clutchIsPressed(valueClutch)) || this.clutchIsPressed(valueClutch));
    }


    engineCanApplyForce(valueClutch){
        return (this.currentRPM >= MIN_RPM_TO_AVOID_SHUTDOWN && !this.clutchIsPressed(valueClutch));
    }


    accelerate(valueClutch, valueAccelerator){
        let rpmReturn = this.engineState.accelerate(valueAccelerator, this.currentRPM, this.currentXInRPMCurve);
        this.currentRPM = rpmReturn[0];
        this.currentXInRPMCurve = rpmReturn[1];
        this.handleEngineShutdown(valueClutch);
    }


    brake(valueClutch, valueBrake){
        let rpmReturn = this.engineState.brake(valueBrake, this.currentRPM, this.currentXInRPMCurve);
        this.currentRPM = rpmReturn[0];
        this.currentXInRPMCurve = rpmReturn[1];
        this.handleEngineShutdown(valueClutch);
    }


    changeShift(valueClutch, newShift){
        if(this.clutchIsPressed(valueClutch)){
            this.currentShift = newShift;
        }else{
            throw new Error("Clutch must be pressed in order to change the shift");
        }
    }


    getCurrentRPM(){
        return this.currentRPM;
    }


    isInReverse(){
        return this.currentShift === REVERSE;
    }
}