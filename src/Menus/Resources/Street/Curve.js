import { AbstractStreet } from "./AbstractStreet";

const POSSIBLE_ROTATIONS = {
    "TOP_TO_LEFT": Math.PI*3/2,
    "LEFT_TO_BOT": 0,
    "BOT_TO_RIGHT": Math.PI/2,
    "RIGHT_TO_TOP": Math.PI
}

export class Curve extends AbstractStreet{
    
    static isValidNinePerNineGrid(ninePerNineGrid){
        //Tiene que tener solo 2 lindantes, y no ser en misma direccion.
        let [rowCount, columnCount] = AbstractStreet.calculateNeighboursFilled(ninePerNineGrid);    
        return (rowCount === 1 && columnCount === 1);
    }

    determineStreetRotation(top, left, bot, right){
        if(top && left){
            return POSSIBLE_ROTATIONS["TOP_TO_LEFT"];
        }
        if(left && bot){
            return POSSIBLE_ROTATIONS["LEFT_TO_BOT"];
        }
        if(bot && right){
            return POSSIBLE_ROTATIONS["BOT_TO_RIGHT"];
        }
        if(right && top){
            return POSSIBLE_ROTATIONS["RIGHT_TO_TOP"];
        }
    }

    getAsJSON(){
        let dict = super.getAsJSON();
        dict["type"] = "CURVE";
        return dict;
    }
}