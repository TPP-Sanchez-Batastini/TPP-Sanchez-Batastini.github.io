import { AbstractStreet } from "./AbstractStreet";

const POSSIBLE_ROTATIONS = {
    "TOP_SINGLE": Math.PI,
    "LEFT_SINGLE": Math.PI*3/2,
    "BOT_SINGLE": 0,
    "RIGHT_SINGLE": Math.PI/2
}
export class TStreet extends AbstractStreet {

    static isValidNinePerNineGrid(ninePerNineGrid){
        let [rowCount, columnCount] = AbstractStreet.calculateNeighboursFilled(ninePerNineGrid);    
        return(columnCount === 2 && rowCount === 1 )|| (columnCount === 1 && rowCount === 2 );
    }
    
    determineStreetRotation(top, left, bot, right){
        if(top && left && right){
            return POSSIBLE_ROTATIONS["TOP_SINGLE"];
        }
        if(left && bot && top){
            return POSSIBLE_ROTATIONS["LEFT_SINGLE"];
        }
        if(bot && right && left){
            return POSSIBLE_ROTATIONS["BOT_SINGLE"];
        }
        if(right && top && bot){
            return POSSIBLE_ROTATIONS["RIGHT_SINGLE"];
        }
    }

    getAsJSON(){
        let dict = super.getAsJSON();
        dict["type"] = "T_STREET";
        return dict;
    }

}