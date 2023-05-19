import { AbstractStreet } from "./AbstractStreet";

const POSSIBLE_ROTATIONS = {
    "HORIZONTAL": 0,
    "VERTICAL": Math.PI/2
}

export class StraightStreet extends AbstractStreet {
    
    
    static isValidNinePerNineGrid(ninePerNineGrid){
        
        let [rowCount, columnCount] = AbstractStreet.calculateNeighboursFilled(ninePerNineGrid);    
        return(columnCount === 2 && rowCount === 0 )|| (columnCount === 0 && rowCount === 2 )

    }

    constructor(ninePerNineGrid, rowIndex, ColumnIndex){
        super(ninePerNineGrid, rowIndex, ColumnIndex);
    }

    determineStreetRotation(top, left, bot, right){
        if(top && bot){
            return POSSIBLE_ROTATIONS["VERTICAL"];
        }
        if(left && right){
            return POSSIBLE_ROTATIONS["HORIZONTAL"];
        }
    }

    isStraight(){
        return true;
    }
}