import Ammo from 'ammo.js'

export default class AmmoInstance{

    static AmmoInstanceToReturn = null;

    constructor() {
        throw new Error('Can not construct singleton. Call get instance instead.');
    }

    static async getInstance(){
        if(!AmmoInstance.AmmoInstanceToReturn){
            AmmoInstance.AmmoInstanceToReturn = await Ammo();
        }
        return AmmoInstance.AmmoInstanceToReturn;
    }
}