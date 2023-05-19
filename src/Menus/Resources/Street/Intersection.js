import { AbstractStreet } from "./AbstractStreet";


export class Intersection extends AbstractStreet{

    static isValidNinePerNineGrid(ninePerNineGrid){
        let [rowCount, columnCount] = AbstractStreet.calculateNeighboursFilled(ninePerNineGrid);    
        return(columnCount === 2 && rowCount === 2 )
    }

    determineStreetRotation(){
        //No sense to rotate it
        return 0;
    }

    getAsJSON(){
        let dict = super.getAsJSON();
        dict["type"] = "INTERSECTION";
        return dict;
    }
}
