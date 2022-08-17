const { default: GlobalControllerHandling } = require("./GlobalControllerHandling");
const STICK_LIMIT = 0.07;
const CLUTCH_PRESED = 1;
const CLUTCH_NOT_PRESED = 1;

class XboxController{
    constructor(auto){
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        this.gamepad = null;
        for (let i = 0; i < gamepads.length; i++) {
          if (gamepads[i]) {
            if (gamepads[i].id.startsWith('Xbox')) {
              this.gamepad = gamepads[i];
            }
          }
        }
        this.buttonA = 0;
        this.buttonB = 1;
        this.buttonX = 2;
        this.buttonY = 3;
        this.buttonL1 = 4;
        this.buttonR1 = 5;
        this.buttonL2 = 6;
        this.buttonR2 = 7;
        this.shareButton = 8;
        this.optionButton = 9;
        this.buttonL3 = 10;
        this.buttonR3 = 11;
        this.padUp = 12;
        this.padDown = 13;
        this.padLeft = 14;
        this.padRight = 15;
        this.buttomHome = 16;
        this.buttonPressed = [];
        this.actualShift = 0;
        for(let i = 0; i <= 16; i++){
            this.buttonPressed.push(false);
        }
        
        this.auto = auto;
        this.xLeftAxe = 0;
        this.yLeftAxe = 1;
        this.xRightAxe = 2;
        this.yRightAxe = 3;
        this.globalControllerHandler = new GlobalControllerHandling(auto);
    }


    checkGamepadChanges(){
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
              if (gamepads[i].id.startsWith('Xbox')) {
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
            //this.globalControllerHandler.updateCar();
        }
    }


    doActionsAxes(){
        if(Math.abs(this.gamepad.axes[this.yLeftAxe]) >= STICK_LIMIT){

            this.globalControllerHandler.handleBrake(this.gamepad.buttons[this.buttonL2].value, this.gamepad.buttons[this.buttonR2].value);
            console.log("Adelante/Abajo Joy Izq: " + this.gamepad.axes[this.yLeftAxe]);
        }
        if(Math.abs(this.gamepad.axes[this.xLeftAxe]) >= STICK_LIMIT){
            console.log("Izq/Der Joy Izq: " + this.gamepad.axes[this.xLeftAxe]);
        }
        if(Math.abs(this.gamepad.axes[this.yRightAxe]) >= STICK_LIMIT){
            console.log("Adelante/Abajo Joy Der: " + this.gamepad.axes[this.yRightAxe]);
        }
        if(Math.abs(this.gamepad.axes[this.xRightAxe]) >= STICK_LIMIT){
            console.log("Izq/Der Joy Der: " + this.gamepad.axes[this.xRightAxe]);
        }
    }


    doActionsTriggers(){
        if (this.gamepad.buttons[this.buttonR2].pressed) {
            //console.log(this.gamepad.buttons[this.buttonR2]);
            this.globalControllerHandler.handleAccelerate(CLUTCH_NOT_PRESED, this.gamepad.buttons[this.buttonR2].value);
            //console.log("accelerator: " + this.gamepad.buttons[this.buttonR2].value);
            //this.auto.acelerar();
        }

        if (this.gamepad.buttons[this.buttonL2].pressed) {
            this.globalControllerHandler.handleBrake(CLUTCH_PRESED, this.gamepad.buttons[this.buttonL2].value);
            //console.log("Break: " + this.gamepad.buttons[this.buttonL2].value);
        }
    }


    doActionsButtons(){
        
        if (this.gamepad.buttons[this.buttonR1].pressed && !this.buttonPressed[this.buttonR1]) {
            console.log("Aumento de marcha (R1)");
            if(this.actualShift < 5){
                this.actualShift += this.actualShift;
                this.globalControllerHandler.changeShift(CLUTCH_PRESED, this.actualShift);
            }
            this.buttonPressed[this.buttonR1] = true;
        }else if(!this.gamepad.buttons[this.buttonR1].pressed){
            
            this.buttonPressed[this.buttonR1] = false;
        }

        if (this.gamepad.buttons[this.buttonL1].pressed && !this.buttonPressed[this.buttonL1]) {
            console.log("reduccion de marcha (L1)");
            if(this.actualShift > 0){
                this.actualShift -= this.actualShift;
                this.globalControllerHandler.changeShift(CLUTCH_PRESED, this.actualShift);
            }
            this.buttonPressed[this.buttonL1] = true;
        }else if(!this.gamepad.buttons[this.buttonL1].pressed){
            this.buttonPressed[this.buttonL1] = false;
        }
        
        if (this.gamepad.buttons[this.shareButton].pressed && !this.buttonPressed[this.shareButton]) {
            console.log("shareButton");
            this.buttonPressed[this.shareButton] = true;
        }else if(!this.gamepad.buttons[this.shareButton].pressed){
            this.buttonPressed[this.shareButton] = false;
        }

        if (this.gamepad.buttons[this.padUp].pressed && !this.buttonPressed[this.padUp]) {
            console.log("padUp");
            this.buttonPressed[this.padUp] = true;
        }else if(!this.gamepad.buttons[this.padUp].pressed){
            this.buttonPressed[this.padUp] = false;
        }

        if (this.gamepad.buttons[this.padDown].pressed && !this.buttonPressed[this.padDown]) {
            console.log("padDown");
            this.buttonPressed[this.padDown] = true;
        }else if(!this.gamepad.buttons[this.padDown].pressed){
            this.buttonPressed[this.padDown] = false;
        }

        if (this.gamepad.buttons[this.padLeft].pressed && !this.buttonPressed[this.padLeft]) {
            console.log("padLeft");
            this.buttonPressed[this.padLeft] = true;
        }else if(!this.gamepad.buttons[this.padLeft].pressed){
            this.buttonPressed[this.padLeft] = false;
        }

        if (this.gamepad.buttons[this.padRight].pressed && !this.buttonPressed[this.padRight]) {
            console.log("padRight");
            this.buttonPressed[this.padRight] = true;
        }else if(!this.gamepad.buttons[this.padRight].pressed){
            this.buttonPressed[this.padRight] = false;
        }

        if (this.gamepad.buttons[this.buttonA].pressed && !this.buttonPressed[this.buttonA]) {
            console.log("buttonA");
            this.buttonPressed[this.buttonA] = true;
        }else if(!this.gamepad.buttons[this.buttonA].pressed){
            this.buttonPressed[this.buttonA] = false;
        }

        if (this.gamepad.buttons[this.buttonB].pressed && !this.buttonPressed[this.buttonB]) {
            console.log("buttonB");
            this.buttonPressed[this.buttonB] = true;
        }else if(!this.gamepad.buttons[this.buttonB].pressed){
            this.buttonPressed[this.buttonB] = false;
        }

        if (this.gamepad.buttons[this.buttonY].pressed && !this.buttonPressed[this.buttonY]) {
            console.log("buttonY");
            this.buttonPressed[this.buttonY] = true;
        }else if(!this.gamepad.buttons[this.buttonY].pressed){
            this.buttonPressed[this.buttonY] = false;
        }

        if (this.gamepad.buttons[this.buttonX].pressed && !this.buttonPressed[this.buttonX]) {
            console.log("buttonX");
            this.buttonPressed[this.buttonX] = true;
        }else if(!this.gamepad.buttons[this.buttonX].pressed){
            this.buttonPressed[this.buttonX] = false;
        }

        if (this.gamepad.buttons[this.buttonR3].pressed && !this.buttonPressed[this.buttonR3]) {
            console.log("buttonR3");
            this.buttonPressed[this.buttonR3] = true;
        }else if(!this.gamepad.buttons[this.buttonR3].pressed){
            this.buttonPressed[this.buttonR3] = false;
        }

        if (this.gamepad.buttons[this.buttonL3].pressed && !this.buttonPressed[this.buttonL3]) {
            console.log("buttonL3");
            this.buttonPressed[this.buttonL3] = true;
        }else if(!this.gamepad.buttons[this.buttonL3].pressed){
            this.buttonPressed[this.buttonL3] = false;
        }

        if (this.gamepad.buttons[this.padUp].pressed && !this.buttonPressed[this.padUp]) {
            console.log("padUp");
            this.buttonPressed[this.padUp] = true;
        }else if(!this.gamepad.buttons[this.padUp].pressed){
            this.buttonPressed[this.padUp] = false;
        }

        if (this.gamepad.buttons[this.padDown].pressed && !this.buttonPressed[this.padDown]) {
            console.log("padDown");
            this.buttonPressed[this.padDown] = true;
        }else if(!this.gamepad.buttons[this.padDown].pressed){
            this.buttonPressed[this.padDown] = false;
        }

        
        if (this.gamepad.buttons[this.padLeft].pressed && !this.buttonPressed[this.padLeft]) {
            console.log("padLeft");
            this.buttonPressed[this.padLeft] = true;
        }else if(!this.gamepad.buttons[this.padLeft].pressed){
            this.buttonPressed[this.padLeft] = false;
        }
        
        if (this.gamepad.buttons[this.padRight].pressed && !this.buttonPressed[this.padRight]) {
            console.log("padRight");
            this.buttonPressed[this.padRight] = true;
        }else if(!this.gamepad.buttons[this.padRight].pressed){
            this.buttonPressed[this.padRight] = false;
        }
        
        if (this.gamepad.buttons[this.buttomHome].pressed && !this.buttonPressed[this.buttomHome]) {
            this.globalControllerHandler.turnOnCar();
            this.buttonPressed[this.buttomHome] = true;
        }else if(!this.gamepad.buttons[this.buttomHome].pressed){
            this.buttonPressed[this.buttomHome] = false;
        }
        
        if (this.gamepad.buttons[this.optionButton].pressed && !this.buttonPressed[this.optionButton]) {
            console.log("optionButton");
            this.buttonPressed[this.optionButton] = true;
        }else if(!this.gamepad.buttons[this.optionButton].pressed){
            this.buttonPressed[this.optionButton] = false;
        }
    }


    doActionByMapping(){
        this.doActionsAxes();
        this.doActionsTriggers();
        this.doActionsButtons();
    }
}

class XboxControllerSingleton{

    static instance;


    constructor() {
        throw new Error('Can not construct singleton. Call get instance instead.');
    }

    
    static getInstance() {
        if (!XboxControllerSingleton.instance) {
            XboxControllerSingleton.instance = new XboxController();
        }
        return XboxControllerSingleton.instance;
    }
}


module.exports = XboxControllerSingleton;