
const { default: GlobalControllerHandling } = require("./GlobalControllerHandling");

const STICK_LIMIT = 0.1;
const CLUTCH_PRESED = 0;
const CLUTCH_NOT_PRESED = 1;

class XboxController{
    constructor(auto, camera){
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        this.gamepad = null;
        for (let i = 0; i < gamepads.length; i++) {
          if (gamepads[i]) {
            if (gamepads[i].id.startsWith('Xbox') || gamepads[i].id.startsWith('xinput')) {
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
        
        this.xLeftAxe = 0;
        this.yLeftAxe = 1;
        this.xRightAxe = 2;
        this.yRightAxe = 3;
        this.globalControllerHandler = new GlobalControllerHandling(auto);
        this.camera = camera;
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
        }
        this.globalControllerHandler.updateCar();
    }

    doActionsAxes(){
        if(Math.abs(this.gamepad.axes[this.yLeftAxe]) >= STICK_LIMIT){    
        }
        if(Math.abs(this.gamepad.axes[this.xLeftAxe]) >= STICK_LIMIT){
            let axe = ((this.gamepad.axes[this.xLeftAxe] )**3)
            this.globalControllerHandler.turnDirection(axe);
        }else{
            this.globalControllerHandler.turnDirection(0);
        }
        if(Math.abs(this.gamepad.axes[this.yRightAxe]) >= STICK_LIMIT){
        }
        let rotation = ((this.gamepad.axes[this.xRightAxe] )**3)
            this.camera.rotate(-rotation);
        // if(Math.abs(this.gamepad.axes[this.xRightAxe]) >= STICK_LIMIT){
        //     let rotation = ((this.gamepad.axes[this.xRightAxe] )**3)
        //     this.camera.rotate(-rotation);
        // }
    }

    doActionHotKeys(){
        this.globalControllerHandler.handleAccelerate(CLUTCH_NOT_PRESED, this.gamepad.buttons[this.buttonR2].value);
        this.globalControllerHandler.handleBrake(CLUTCH_PRESED, this.gamepad.buttons[this.buttonL2].value);
    }

    doActionsTriggers(){
        if (this.gamepad.buttons[this.buttonR2].pressed) {
        }

        if (this.gamepad.buttons[this.buttonL2].pressed) {
        }
    }



    doActionsButtons(){
        
        if (this.gamepad.buttons[this.buttonR1].pressed && !this.buttonPressed[this.buttonR1]) {
            if(this.actualShift <= 5){
                this.actualShift += 1;
                this.globalControllerHandler.changeShift(CLUTCH_PRESED, this.actualShift);
            }
            this.buttonPressed[this.buttonR1] = true;
        }else if(!this.gamepad.buttons[this.buttonR1].pressed){
            
            this.buttonPressed[this.buttonR1] = false;
        }

        if (this.gamepad.buttons[this.buttonL1].pressed && !this.buttonPressed[this.buttonL1]) {
            if(this.actualShift >= 0){
                this.actualShift -= 1;
                this.globalControllerHandler.changeShift(CLUTCH_PRESED, this.actualShift);
            }
            this.buttonPressed[this.buttonL1] = true;
        }else if(!this.gamepad.buttons[this.buttonL1].pressed){
            this.buttonPressed[this.buttonL1] = false;
        }
        
        if (this.gamepad.buttons[this.shareButton].pressed && !this.buttonPressed[this.shareButton]) {
            this.buttonPressed[this.shareButton] = true;
        }else if(!this.gamepad.buttons[this.shareButton].pressed){
            this.buttonPressed[this.shareButton] = false;
        }

        if (this.gamepad.buttons[this.padUp].pressed && !this.buttonPressed[this.padUp]) {
            this.globalControllerHandler.turnParkingLight();
            this.buttonPressed[this.padUp] = true;
        }else if(!this.gamepad.buttons[this.padUp].pressed){
            this.buttonPressed[this.padUp] = false;
        }


        if (this.gamepad.buttons[this.padDown].pressed && !this.buttonPressed[this.padDown]) {
            this.buttonPressed[this.padDown] = true;
        }else if(!this.gamepad.buttons[this.padDown].pressed){
            this.buttonPressed[this.padDown] = false;
        }

        if (this.gamepad.buttons[this.padLeft].pressed && !this.buttonPressed[this.padLeft]) {
            this.globalControllerHandler.turnLeftLight();
            this.buttonPressed[this.padLeft] = true;
        }else if(!this.gamepad.buttons[this.padLeft].pressed){
            this.buttonPressed[this.padLeft] = false;
        }

        if (this.gamepad.buttons[this.padRight].pressed && !this.buttonPressed[this.padRight]) {
            
            this.globalControllerHandler.turnRightLight();
            this.buttonPressed[this.padRight] = true;
        }else if(!this.gamepad.buttons[this.padRight].pressed){
            this.buttonPressed[this.padRight] = false;
        }

        if (this.gamepad.buttons[this.buttonA].pressed && !this.buttonPressed[this.buttonA]) {
            this.buttonPressed[this.buttonA] = true;
        }else if(!this.gamepad.buttons[this.buttonA].pressed){
            this.buttonPressed[this.buttonA] = false;
        }

        if (this.gamepad.buttons[this.buttonB].pressed && !this.buttonPressed[this.buttonB]) {
            this.buttonPressed[this.buttonB] = true;
        }else if(!this.gamepad.buttons[this.buttonB].pressed){
            this.buttonPressed[this.buttonB] = false;
        }

        if (this.gamepad.buttons[this.buttonY].pressed && !this.buttonPressed[this.buttonY]) {
            this.buttonPressed[this.buttonY] = true;
        }else if(!this.gamepad.buttons[this.buttonY].pressed){
            this.buttonPressed[this.buttonY] = false;
        }

        if (this.gamepad.buttons[this.buttonX].pressed && !this.buttonPressed[this.buttonX]) {
            this.globalControllerHandler.doHorn();
            this.buttonPressed[this.buttonX] = true;
        }else if(!this.gamepad.buttons[this.buttonX].pressed){
            this.buttonPressed[this.buttonX] = false;
        }

        if (this.gamepad.buttons[this.buttonR3].pressed && !this.buttonPressed[this.buttonR3]) {

            this.buttonPressed[this.buttonR3] = true;
        }else if(!this.gamepad.buttons[this.buttonR3].pressed){
            this.buttonPressed[this.buttonR3] = false;
        }

        if (this.gamepad.buttons[this.buttonL3].pressed && !this.buttonPressed[this.buttonL3]) {
            this.buttonPressed[this.buttonL3] = true;
        }else if(!this.gamepad.buttons[this.buttonL3].pressed){
            this.buttonPressed[this.buttonL3] = false;
        }
        
        if (this.gamepad.buttons[this.buttomHome].pressed && !this.buttonPressed[this.buttomHome]) {
            this.globalControllerHandler.changeShiftBox("semi-auto");
            this.buttonPressed[this.buttomHome] = true;
        }else if(!this.gamepad.buttons[this.buttomHome].pressed){
            this.buttonPressed[this.buttomHome] = false;
        }
        
        if (this.gamepad.buttons[this.optionButton].pressed && !this.buttonPressed[this.optionButton]) {
            this.globalControllerHandler.turnOnCar();
            this.buttonPressed[this.optionButton] = true;
        }else if(!this.gamepad.buttons[this.optionButton].pressed){
            this.buttonPressed[this.optionButton] = false;
        }
    }

    doActionByMapping(){
        this.doActionHotKeys();
        this.doActionsAxes();
        this.doActionsTriggers();
        this.doActionsButtons();
    }
}

export default class XboxControllerSingleton{

    static instance;

    constructor() {
        throw new Error('Can not construct singleton. Call get instance instead.');
    }

    static getInstance(auto, camera) {
        if (!XboxControllerSingleton.instance) {
            XboxControllerSingleton.instance = new XboxController(auto, camera);
        }
        return XboxControllerSingleton.instance;
    }
}