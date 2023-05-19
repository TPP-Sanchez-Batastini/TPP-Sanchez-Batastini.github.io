import { AbstractStreet } from "./AbstractStreet";


export class Intersection extends AbstractStreet{

    static isValidNinePerNineGrid(ninePerNineGrid){
        let [rowCount, columnCount] = AbstractStreet.calculateNeighboursFilled(ninePerNineGrid);    
        return(columnCount === 2 && rowCount === 2 )
    }

    constructor(ninePerNineGrid, rowIndex, ColumnIndex){
        super(ninePerNineGrid, rowIndex, ColumnIndex);
    }

    determineStreetRotation(){
        //No sense to rotate it
        return 0;
    }
}
