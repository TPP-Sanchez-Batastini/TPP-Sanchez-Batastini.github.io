import { EXPONENTIAL_COEF_TO_RPM, MAX_RPM } from './CarEngineStates/AbstractEngineState';
import TurnedOffEngine from './CarEngineStates/TurnedOffEngine';
import TurnedOnEngine from './CarEngineStates/TurnedOnEngine';

const MIN_RPM_TO_AVOID_SHUTDOWN = 0;//1000
const MIN_VALUE_CLUTCH_TO_AVOID_SHUTDOWN = 0.25;

export default class CarEngine{


    constructor(){
        this.engineState = new TurnedOffEngine();
        this.currentRPM = 0;
        this.currentXInRPMCurve = 0;
        this.playbackRate = 1.1;
    }


    turnOn(){
        if(this.engineState instanceof TurnedOffEngine){
            new Audio('./sounds/encendido.wav').play();
            this.engineState = new TurnedOnEngine();
            setTimeout(() => {
                this.soundEngine = new (window.AudioContext || window.webkitAudioContext)();
                fetch("./sounds/engine.wav").then(
                    response => response.arrayBuffer()
                ).then(buffer => this.soundEngine.decodeAudioData(buffer)
                ).then(buffer => {
                    this.soundEngineSource = this.soundEngine.createBufferSource();
                    this.soundEngineSource.buffer = buffer;
                    this.soundEngineSource.loop = true;
                    this.soundEngineSource.connect(this.soundEngine.destination);
                    this.soundEngineSource.start();
                });
            }, 1300);
            
        }
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
        if (this.soundEngineSource) this.soundEngineSource.playbackRate.value = 1.1 + this.currentRPM/MAX_RPM * 2.0;
        this.currentXInRPMCurve = rpmReturn[1];
        this.handleEngineShutdown(valueClutch,shiftBox);
    }


    brake(valueClutch, valueBrake,shiftBox){
        let rpmReturn = this.engineState.brake(valueBrake, this.currentRPM, this.currentXInRPMCurve);
        this.currentRPM = rpmReturn[0];
        if (this.soundEngineSource) this.soundEngineSource.playbackRate.value = 1.1 + this.currentRPM/MAX_RPM * 2.0;
        this.currentXInRPMCurve = rpmReturn[1];
        this.handleEngineShutdown(valueClutch,shiftBox);
    }


    changeRPM(RPMModification){
        this.currentRPM = RPMModification;
        if( (-this.currentRPM/MAX_RPM + 1) > 0 ){
            this.currentXInRPMCurve = -Math.log( -this.currentRPM/MAX_RPM + 1) * EXPONENTIAL_COEF_TO_RPM;
            if(this.currentXInRPMCurve < 0){
                this.currentXInRPMCurve = 0;
            }
        }else if(this.currentRPM === MAX_RPM){
            this.currentXInRPMCurve = EXPONENTIAL_COEF_TO_RPM * 3;
        }
    }


    getCurrentRPM(){
        return this.currentRPM;
    }
}