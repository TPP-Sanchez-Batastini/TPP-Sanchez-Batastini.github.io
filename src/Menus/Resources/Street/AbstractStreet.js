
const STANDARD_BOX_LONG = 30;

export class AbstractStreet{

    constructor(ninePerNineGrid, rowIndex, columnIndex){
        const rightFilled = ninePerNineGrid[1][2].filled;
        const topFilled = ninePerNineGrid[0][1].filled;
        const botFilled = ninePerNineGrid[2][1].filled;
        const leftFilled = ninePerNineGrid[1][0].filled;
        this.rotation = this.determineStreetRotation(topFilled, leftFilled, botFilled, rightFilled);
        this.long = [
            STANDARD_BOX_LONG, 
            STANDARD_BOX_LONG
        ];
        this.position = [
            rowIndex*STANDARD_BOX_LONG + STANDARD_BOX_LONG/2, 
            columnIndex*STANDARD_BOX_LONG + STANDARD_BOX_LONG/2
        ];
    }

    static isValidNinePerNineGrid(ninePerNineGrid){
        //To implement by each son
    }

    static sumValueForCell(cell){
        return cell.filled ? 1 : 0
    }

    static calculateNeighboursFilled(ninePerNineGrid){
        let rowCount = 0;
        let columnCount = 0;
        rowCount += this.sumValueForCell(ninePerNineGrid[1][0]) + this.sumValueForCell(ninePerNineGrid[1][2]);
        columnCount += this.sumValueForCell(ninePerNineGrid[0][1]) + this.sumValueForCell(ninePerNineGrid[2][1]);
        return [rowCount, columnCount];
    }

    isStraight(){
        return false;
    }


    determineStreetRotation(){
        //To be defined by sons
    }

    getAsJSON(){
        return {
            "position_x": this.position[0],
            "position_y": this.position[1],
            "rotation": this.rotation,
            "long_x": this.long[0],
            "long_y": this.long[1]
        }
    }
   
}