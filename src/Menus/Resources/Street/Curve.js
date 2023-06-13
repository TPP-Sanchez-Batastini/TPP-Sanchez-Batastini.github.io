import { AbstractStreet } from "./AbstractStreet";

const POSSIBLE_ROTATIONS = {
    "TOP_TO_LEFT": 0,
    "LEFT_TO_BOT": Math.PI/2,
    "BOT_TO_RIGHT": Math.PI,
    "RIGHT_TO_TOP": Math.PI*3/2
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