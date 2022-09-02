export default class Observable{

    constructor(){
        this.observers = [];
    }

    attachObserver(observer){
        this.observers.push(observer);
    }

    removeObserver(observer){
        let index = this.observers.indexOf(observer);
        if(index > -1){
            this.observers.splice(index, 1);
        }
    }

    notifyObservers(stateToSend){
        for (let i = 0; i < this.observers.length; i++){
            this.observers[i].update(stateToSend);
        }
    }
}