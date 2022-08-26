import ShiftBox from '../ShiftBox';

export default class ManualBox extends ShiftBox{

    changeShift(valueClutch, newShift, currentVelocity){
        if(this.isValidShift(newShift) && this.clutchIsPressed(valueClutch)){
            this.currentShift = newShift;
            this.carEngine.changeRPM(this.getValueForNewRPM(newShift, currentVelocity));
        }else{
            throw new Error("Can't change shift if clutch is not pressed");
        }
    }

}