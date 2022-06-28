class LogitechG29Controller{
    constructor(){
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
        this.wheelAxes = 0;
        this.clutch = 1;
        this.accelerator = 2;
        this.break = 5;
        this.DPad = 9;

        //This is conveniently defined by using distances if needed, it is not exact.
        this.valueDpadUP = -1;
        this.valueDpadDOWN = 0.14285719394683838;
        this.valueDpadLEFT = 0.7142857313156128;
        this.valueDpadRIGHT = -0.4285714030265808;
    }

    checkEvents(){
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        this.gamepad = null;
        for (let i = 0; i < gamepads.length; i++) {
          if (gamepads[i]) {
            if (gamepads[i].id.startsWith('G29 Driving Force Racing Wheel')) {
              this.gamepad = gamepads[i];
            }
          }
        }
        if(this.gamepad.axes[this.accelerator] !== 1.0){
            console.log("accel: " + this.gamepad.axes[this.accelerator]);
        }
        if(this.gamepad.axes[this.clutch] !== 1.0){
            console.log("clutch: " + this.gamepad.axes[this.clutch]);
        }
        if(this.gamepad.axes[this.break] !== 1.0){
            console.log("break: " + this.gamepad.axes[this.break]);
        }
        if(this.gamepad.axes[this.wheelAxes] <= -0.05 || this.gamepad.axes[this.wheelAxes] >= 0.05){
            console.log("giro volante: " + this.gamepad.axes[this.wheelAxes]);
        }
        if(this.gamepad.axes[this.DPad] !== 1.2857143878936768){
            
            if(this.gamepad.axes[this.DPad] === this.valueDpadDOWN){
                console.log("DPAD DOWN");
            }
            if(this.gamepad.axes[this.DPad] === this.valueDpadLEFT){
                console.log("DPAD LEFT");
            }
            if(this.gamepad.axes[this.DPad] === this.valueDpadRIGHT){
                console.log("DPAD RIGHT");
            }
            if(this.gamepad.axes[this.DPad] === this.valueDpadUP){
                console.log("DPAD UP");
            }
        }
        if (this.gamepad.buttons[this.buttonX].pressed) {
            console.log("BOTON X");
        }
        if (this.gamepad.buttons[this.buttonTriangle].pressed) {
            console.log("BOTON TRIANGULO");
        }
        if (this.gamepad.buttons[this.buttonCircle].pressed) {
            console.log("BOTON CIRCULO");
        }
        if (this.gamepad.buttons[this.buttonSquare].pressed) {
            console.log("BOTON CUADRADO");
        }
        if (this.gamepad.buttons[this.psButton].pressed) {
            console.log("BOTON PS");
        }
        if (this.gamepad.buttons[this.buttonPlus].pressed) {
            console.log("BOTON +");
        }
        if (this.gamepad.buttons[this.buttonMinus].pressed) {
            console.log("BOTON -");
        }
        if (this.gamepad.buttons[this.buttonL2].pressed) {
            console.log("BOTON L2");
        }
        if (this.gamepad.buttons[this.buttonL3].pressed) {
            console.log("BOTON L3");
        }
        if (this.gamepad.buttons[this.buttonR2].pressed) {
            console.log("BOTON R2");
        }
        if (this.gamepad.buttons[this.buttonR3].pressed) {
            console.log("BOTON R3");
        }
        if (this.gamepad.buttons[this.enter].pressed) {
            console.log("BOTON ENTER");
        }        
        if (this.gamepad.buttons[this.shareButton].pressed) {
            console.log("BOTON SHARE");
        }
        if (this.gamepad.buttons[this.optionsButton].pressed) {
            console.log("BOTON OPTIONS");
        }
        if (this.gamepad.buttons[this.bumperLeft].pressed) {
            console.log("BOTON BUMPER LEFT");
        }
        if (this.gamepad.buttons[this.bumperRight].pressed) {
            console.log("BOTON BUMPER RIGHT");
        }
        if (this.gamepad.buttons[this.firstShift].pressed) {
            console.log("MARCHA 1");
        }
        if (this.gamepad.buttons[this.secondShift].pressed) {
            console.log("MARCHA 2");
        }
        if (this.gamepad.buttons[this.thirdShift].pressed) {
            console.log("MARCHA 3");
        }
        if (this.gamepad.buttons[this.fourthShift].pressed) {
            console.log("MARCHA 4");
        }
        if (this.gamepad.buttons[this.fifthShift].pressed) {
            console.log("MARCHA 5");
        }
        if (this.gamepad.buttons[this.sixthShift].pressed) {
            console.log("MARCHA 6");
        }
        if (this.gamepad.buttons[this.reverseShift].pressed) {
            console.log("MARCHA REVERSA");
        }
        if (this.gamepad.buttons[this.wheelInEnterLeft].pressed) {
            console.log("MARCHA RUEDA IZQ");
        }
        if (this.gamepad.buttons[this.wheelInEnterRight].pressed) {
            console.log("MARCHA RUEDA DER");
        }
    }
}

class LogitechG29ControllerSingleton{

    static instance;

    constructor() {
        throw new Error('Can not construct singleton. Call get instance instead.');
    }

    static getInstance() {
        if (!LogitechG29ControllerSingleton.instance) {
            LogitechG29ControllerSingleton.instance = new LogitechG29Controller();
        }
        return LogitechG29ControllerSingleton.instance;
    }
}


module.exports = LogitechG29ControllerSingleton;