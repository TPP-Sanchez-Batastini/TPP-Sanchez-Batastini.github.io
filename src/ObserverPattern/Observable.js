import Observer from "./Observer"

export default class Observable{

    constructor(){
        this.observers = [];
    }

    attachObserver(observer){
        this.observers.push(observer);
    }

    removeObserver(observer){
        this.observers.remove(observer);
    }

    notifyObservers(stateToSend){
        for (let i = 0; i < this.observers.length; i++){
            this.observers[i].update(stateToSend);
        }
    }
}