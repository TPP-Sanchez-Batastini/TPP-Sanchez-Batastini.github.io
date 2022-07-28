//Methods to override. This is an interface but can not be declared as interface in JS.
export default class Observer{

    constructor(){
        this.observedState = null;
    }

    update(newState){
        this.observedState = newState;
    }
}