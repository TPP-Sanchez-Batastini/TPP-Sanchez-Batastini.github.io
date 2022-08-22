const { default: GlobalControllerHandling } = require("./GlobalControllerHandling");

const DPAD_NOT_PRESSED = 1.2857143878936768;
const DPAD_UP = -1;
const DPAD_UP_PRESSED = 0;
const DPAD_DOWN = 0.14285719394683838;
const DPAD_DOWN_PRESSED = 1;
const DPAD_LEFT = 0.7142857313156128;
const DPAD_LEFT_PRESSED = 2;
const DPAD_RIGHT = -0.4285714030265808;
const DPAD_RIGHT_PRESSED = 3;


class LogitechG29Controller{
    constructor(carLogic){
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        this.gamepad = null;
        for (let i = 0; i < gamepads.length; i++) {
          if (gamepads[i]) {
            if (gamepads[i].id.startsWith('G29 Driving Force Racing Wheel')) {
              this.gamepad = gamepads[i];
            }
          }
        }
        this.buttonX = 0;
        this.buttonSquare = 1;
        this.buttonCircle = 2;
        this.buttonTriangle = 3;
        this.bumperRight = 4;
        this.bumperLeft = 5;
        this.buttonR2 = 6;
        this.buttonL2 = 7;
        this.shareButton = 8;
        this.optionsButton = 9;
        this.buttonR3 = 10;
        this.buttonL3 = 11;
        this.firstShift = 12;
        this.secondShift = 13;
        this.thirdShift = 14;
        this.fourthShift = 15;
        this.fifthShift = 16;
        this.sixthShift = 17;
        this.reverseShift = 18;
        this.buttonPlus = 19;
        this.buttonMinus = 20;
        this.wheelInEnterRight = 21;
        this.wheelInEnterLeft = 22;
        this.enter = 23;
        this.psButton = 24;

        this.buttonsPressed = [];
        for(let i=0; i <= 24; i++){
            this.buttonsPressed.push(false);
        }

        this.wheelAxes = 0;
        this.clutch = 1;
        this.accelerator = 2;
        this.brake = 5;
        this.DPad = 9;

        //This is conveniently defined by using distances if needed, it is not exact.
        this.valueDpadUP = DPAD_UP;
        this.valueDpadDOWN = DPAD_DOWN;
        this.valueDpadLEFT = DPAD_LEFT;
        this.valueDpadRIGHT = DPAD_RIGHT;

        this.dpadPressed = [];
        for(let i=0; i <= 3; i++){
            this.dpadPressed.push(false);
        }
        
        this.globalControllerHandler = new GlobalControllerHandling(carLogic);
    }

    
    checkGamepadChanges(){
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
              if (gamepads[i].id.startsWith('G29 Driving Force Racing Wheel')) {
                this.gamepad = gamepads[i];
              }
            }
        }
    }


    checkEvents(){
        this.gamepad = null;
        this.checkGamepadChanges();
        if(this.gamepad != null){
            this.doActionByMapping();
            this.globalControllerHandler.updateCar();
        }
    }


    doActionsPedals(){
        this.globalControllerHandler.handleAccelerate(this.gamepad.axes[this.clutch], this.gamepad.axes[this.accelerator]);
        this.globalControllerHandler.handleBrake(this.gamepad.axes[this.clutch], this.gamepad.axes[this.brake]);
    }


    doActionsWheel(){
        this.globalControllerHandler.turnDirection(this.gamepad.axes[this.wheelAxes]);
    }


    doActionsDPad(){
        if(this.gamepad.axes[this.DPad] !== DPAD_NOT_PRESSED){
            
            if(this.gamepad.axes[this.DPad] === this.valueDpadDOWN && !this.dpadPressed[DPAD_DOWN_PRESSED]){
                console.log("DPAD DOWN");
                this.dpadPressed[DPAD_DOWN_PRESSED] = true;
            }else if (this.gamepad.axes[this.DPad] !== this.valueDpadDOWN){
                this.dpadPressed[DPAD_DOWN_PRESSED] = false;
            }

            if(this.gamepad.axes[this.DPad] === this.valueDpadLEFT && !this.dpadPressed[DPAD_LEFT_PRESSED]){
                console.log("DPAD LEFT");
                this.dpadPressed[DPAD_LEFT_PRESSED] = true;
            }else if (this.gamepad.axes[this.DPad] !== this.valueDpadLEFT){
                this.dpadPressed[DPAD_LEFT_PRESSED] = false;
            }

            if(this.gamepad.axes[this.DPad] === this.valueDpadRIGHT && !this.dpadPressed[DPAD_RIGHT_PRESSED]){
                console.log("DPAD RIGHT");
                this.dpadPressed[DPAD_RIGHT_PRESSED] = true;
            }else if (this.gamepad.axes[this.DPad] !== this.valueDpadRIGHT){
                this.dpadPressed[DPAD_RIGHT_PRESSED] = false;
            }

            if(this.gamepad.axes[this.DPad] === this.valueDpadUP && !this.dpadPressed[DPAD_UP_PRESSED]){
                console.log("DPAD UP");
                this.dpadPressed[DPAD_UP_PRESSED] = true;
            }else if (this.gamepad.axes[this.DPad] !== this.valueDpadUP){
                this.dpadPressed[DPAD_UP_PRESSED] = false;
            }
        }else{
            for(let i = 0; i < this.dpadPressed.length; i++){
                this.dpadPressed[i] = false;
            }
        }
    }


    doActionsButtons(){

        if (this.gamepad.buttons[this.buttonX].pressed && !this.buttonsPressed[this.buttonX]) {
            console.log("BOTON X");
            this.buttonsPressed[this.buttonX] = true
        }else if(!this.gamepad.buttons[this.buttonX].pressed){
            this.buttonsPressed[this.buttonX] = false;
        }


        if (this.gamepad.buttons[this.buttonTriangle].pressed && !this.buttonsPressed[this.buttonTriangle]) {
            console.log("BOTON TRIANGULO");
            this.buttonsPressed[this.buttonTriangle] = true;
        }else if(!this.gamepad.buttons[this.buttonTriangle].pressed){
            this.buttonsPressed[this.buttonTriangle] = false;
        }


        if (this.gamepad.buttons[this.buttonCircle].pressed && !this.buttonsPressed[this.buttonCircle]) {
            console.log("BOTON CIRCULO");
            this.buttonsPressed[this.buttonCircle] = true;
        }else if(!this.gamepad.buttons[this.buttonCircle].pressed){
            this.buttonsPressed[this.buttonCircle] = false;
        }


        if (this.gamepad.buttons[this.buttonSquare].pressed && !this.buttonsPressed[this.buttonSquare]) {
            console.log("BOTON CUADRADO");
            this.buttonsPressed[this.buttonSquare] = true;
        }else if(!this.gamepad.buttons[this.buttonSquare].pressed){
            this.buttonsPressed[this.buttonSquare] = false;
        }


        if (this.gamepad.buttons[this.psButton].pressed && !this.buttonsPressed[this.psButton]) {
            console.log("BOTON PS");
            this.buttonsPressed[this.psButton] = true;
        }else if(!this.gamepad.buttons[this.psButton].pressed){
            this.buttonsPressed[this.psButton] = false;
        }


        if (this.gamepad.buttons[this.buttonPlus].pressed && !this.buttonsPressed[this.buttonPlus]) {
            console.log("BOTON +");
            this.buttonsPressed[this.buttonPlus] = true;
        }else if(!this.gamepad.buttons[this.buttonPlus].pressed){
            this.buttonsPressed[this.buttonPlus] = false;
        }


        if (this.gamepad.buttons[this.buttonMinus].pressed && !this.buttonsPressed[this.buttonMinus]) {
            console.log("BOTON -");
            this.buttonsPressed[this.buttonMinus] = true;
        }else if(!this.gamepad.buttons[this.buttonMinus].pressed){
            this.buttonsPressed[this.buttonMinus] = false;
        }


        if (this.gamepad.buttons[this.buttonL2].pressed && !this.buttonsPressed[this.buttonL2]) {
            console.log("BOTON L2");
            this.buttonsPressed[this.buttonL2] = true;
        }else if(!this.gamepad.buttons[this.buttonL2].pressed){
            this.buttonsPressed[this.buttonL2] = false;
        }


        if (this.gamepad.buttons[this.buttonL3].pressed && !this.buttonsPressed[this.buttonL3]) {
            console.log("BOTON L3");
            this.buttonsPressed[this.buttonL3] = true;
        }else if(!this.gamepad.buttons[this.buttonL3].pressed){
            this.buttonsPressed[this.buttonL3] = false;
        }


        if (this.gamepad.buttons[this.buttonR2].pressed && !this.buttonsPressed[this.buttonR2]) {
            this.globalControllerHandler.turnOnCar();
            this.buttonsPressed[this.buttonR2] = true;
        }else if(!this.gamepad.buttons[this.buttonR2].pressed){
            this.buttonsPressed[this.buttonR2] = false;
        }


        if (this.gamepad.buttons[this.buttonR3].pressed && !this.buttonsPressed[this.buttonR3]) {
            console.log("BOTON R3");
        this.buttonsPressed[this.buttonR3] = true;
        }else if(!this.gamepad.buttons[this.buttonR3].pressed){
            this.buttonsPressed[this.buttonR3] = false;
        }


        if (this.gamepad.buttons[this.enter].pressed && !this.buttonsPressed[this.enter]) {
            console.log("BOTON ENTER");
            this.buttonsPressed[this.enter] = true;
        }else if(!this.gamepad.buttons[this.enter].pressed){
            this.buttonsPressed[this.enter] = false;
        }
        
        
        if (this.gamepad.buttons[this.shareButton].pressed && !this.buttonsPressed[this.shareButton]) {
            console.log("BOTON SHARE");
            this.buttonsPressed[this.shareButton] = true;
        }else if(!this.gamepad.buttons[this.shareButton].pressed){
            this.buttonsPressed[this.shareButton] = false;
        }


        if (this.gamepad.buttons[this.optionsButton].pressed && !this.buttonsPressed[this.optionsButton]) {
            console.log("BOTON OPTIONS");
            this.buttonsPressed[this.optionsButton] = true;
        }else if(!this.gamepad.buttons[this.optionsButton].pressed){
            this.buttonsPressed[this.optionsButton] = false;
        }


        if (this.gamepad.buttons[this.bumperLeft].pressed && !this.buttonsPressed[this.bumperLeft]) {
            console.log("BOTON BUMPER LEFT");
            this.buttonsPressed[this.bumperLeft] = true;
        }else if(!this.gamepad.buttons[this.bumperLeft].pressed){
            this.buttonsPressed[this.bumperLeft] = false;
        }


        if (this.gamepad.buttons[this.bumperRight].pressed && !this.buttonsPressed[this.bumperRight]) {
            console.log("BOTON BUMPER RIGHT");
            this.buttonsPressed[this.bumperRight] = true;
        }else if(!this.gamepad.buttons[this.bumperRight].pressed){
            this.buttonsPressed[this.bumperRight] = false;
        }


        if (this.gamepad.buttons[this.wheelInEnterLeft].pressed && !this.buttonsPressed[this.wheelInEnterLeft]) {
            console.log("RUEDA IZQ");
            this.buttonsPressed[this.wheelInEnterLeft] = true;
        }else if(!this.gamepad.buttons[this.wheelInEnterLeft].pressed){
            this.buttonsPressed[this.wheelInEnterLeft] = false;
        }
        if (this.gamepad.buttons[this.wheelInEnterRight].pressed && !this.buttonsPressed[this.wheelInEnterRight]) {
            console.log("RUEDA DER");
            this.buttonsPressed[this.wheelInEnterRight] = true;
        }else if(!this.gamepad.buttons[this.wheelInEnterRight].pressed){
            this.buttonsPressed[this.wheelInEnterRight] = false;
        }
    }


    doActionsShifter(){
        if (this.gamepad.buttons[this.firstShift].pressed && !this.buttonsPressed[this.firstShift]) {
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], 1);
            this.buttonsPressed[this.firstShift] = true;
        }else if(!this.gamepad.buttons[this.firstShift].pressed && this.buttonsPressed[this.firstShift]){
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], 0);
            this.buttonsPressed[this.firstShift] = false;
        }
        if (this.gamepad.buttons[this.secondShift].pressed && !this.buttonsPressed[this.secondShift]) {
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], 2);
            this.buttonsPressed[this.secondShift] = true;
        }else if(!this.gamepad.buttons[this.secondShift].pressed && this.buttonsPressed[this.secondShift]){
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], 0);
            this.buttonsPressed[this.secondShift] = false;
        }
        if (this.gamepad.buttons[this.thirdShift].pressed && !this.buttonsPressed[this.thirdShift]) {
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], 3);
            this.buttonsPressed[this.thirdShift] = true;
        }else if(!this.gamepad.buttons[this.thirdShift].pressed && this.buttonsPressed[this.thirdShift]){
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], 0);
            this.buttonsPressed[this.thirdShift] = false;
        }
        if (this.gamepad.buttons[this.fourthShift].pressed && !this.buttonsPressed[this.fourthShift]) {
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], 4);
            this.buttonsPressed[this.fourthShift] = true;
        }else if(!this.gamepad.buttons[this.fourthShift].pressed && this.buttonsPressed[this.fourthShift]){
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], 0);
            this.buttonsPressed[this.fourthShift] = false;
        }
        if (this.gamepad.buttons[this.fifthShift].pressed && !this.buttonsPressed[this.fifthShift]) {
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], 5);
            this.buttonsPressed[this.fifthShift] = true;
        }else if(!this.gamepad.buttons[this.fifthShift].pressed && this.buttonsPressed[this.fifthShift]){
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], 0);
            this.buttonsPressed[this.fifthShift] = false;
        }
        if (this.gamepad.buttons[this.sixthShift].pressed && !this.buttonsPressed[this.sixthShift]) {
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], 6);
            this.buttonsPressed[this.sixthShift] = true;
        }else if(!this.gamepad.buttons[this.sixthShift].pressed && this.buttonsPressed[this.sixthShift]){
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], 0);
            this.buttonsPressed[this.sixthShift] = false;
        }
        if (this.gamepad.buttons[this.reverseShift].pressed && !this.buttonsPressed[this.reverseShift]) {
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], -1);
            this.buttonsPressed[this.reverseShift] = true;
        }else if(!this.gamepad.buttons[this.reverseShift].pressed && this.buttonsPressed[this.reverseShift]){
            this.globalControllerHandler.changeShift(this.gamepad.axes[this.clutch], 0);
            this.buttonsPressed[this.reverseShift] = false;
        }
    }


    doActionByMapping(){
        this.doActionsPedals();
        this.doActionsWheel();
        this.doActionsDPad();
        this.doActionsButtons();
        this.doActionsShifter();
    }


}


export default class LogitechG29ControllerSingleton{

    static instance;

    constructor() {
        throw new Error('Can not construct singleton. Call get instance instead.');
    }

    static getInstance(carLogic) {
        if (!LogitechG29ControllerSingleton.instance) {
            LogitechG29ControllerSingleton.instance = new LogitechG29Controller(carLogic);
        }
        return LogitechG29ControllerSingleton.instance;
    }
}


//module.exports = LogitechG29ControllerSingleton;