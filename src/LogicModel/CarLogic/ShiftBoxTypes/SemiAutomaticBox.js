import ShiftBox from '../ShiftBox';

export default class SemiAutomaticBox extends ShiftBox{

    changeShift(valueClutch, newShift, currentVelocity){
        if(this.isValidShift(newShift)){
            this.currentShift = newShift;
            this.carEngine.changeRPM(this.getValueForNewRPM(newShift, currentVelocity, valueClutch));
        }
    }
}