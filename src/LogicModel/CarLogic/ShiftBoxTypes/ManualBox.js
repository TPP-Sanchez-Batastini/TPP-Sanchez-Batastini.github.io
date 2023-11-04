import ShiftBox from '../ShiftBox';
const MIN_RPM_TO_AVOID_SHUTDOWN = 800;
export default class ManualBox extends ShiftBox{

    
    changeShift(valueClutch, newShift, currentVelocity){
        if(this.isValidShift(newShift) && this.clutchIsPressed(valueClutch)){
            this.currentShift = newShift;
            this.carEngine.changeRPM(this.getValueForNewRPM(newShift, currentVelocity, valueClutch));
        }else{
            //throw new Error("Can't change shift if clutch is not pressed");
        }
    }


    shutDownEngine(valueClutch, currentRPM){
        return this.currentShift !== 0 && !this.clutchIsPressed(valueClutch) && currentRPM < MIN_RPM_TO_AVOID_SHUTDOWN;
    }
}