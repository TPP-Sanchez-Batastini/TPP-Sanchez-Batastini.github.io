import { StraightStreet, TStreet, Intersection, Curve } from "./Street";

const TYPES_OF_STREETS = [
    StraightStreet,
    Curve,
    TStreet,
    Intersection
];

export class StreetFactory{
    
    constructor(levelGrid, isInfiniteLevel){
        this.levelGrid = levelGrid;
        this.getNinePerNineGrid = isInfiniteLevel ? this.getNinePerNineGridInfinite : this.getNinePerNineGridFinite;
    }

    constructStreets(){
        const straightStreetsArray = [];
        const curvedStreetsArray = [];
        //ararco desde la parte superior izq
        for ( let i = 0; i < this.levelGrid.length ; i++ ){
            for ( let j = 0; j < this.levelGrid[i].length ; j++ ){
                const myCell = this.levelGrid[i][j];
                if (myCell.filled){
                    const streetObject = this.defineTypeOfStreet(i, j);
                    if (streetObject.isStraight()){
                        straightStreetsArray.push(streetObject);
                    }
                    else{
                        curvedStreetsArray.push(streetObject);
                    }
                }
            }
            
        }
        const conjunctedStraightStreets = this.linkStraightStreets(straightStreetsArray);
        const finalArray = [...conjunctedStraightStreets, ...curvedStreetsArray];
        return finalArray.map(street => street.getAsJSON());
    }

    getNinePerNineGridInfinite(indexRow, indexColumn){
        const matrix = [];
        for (let i = indexRow - 1; i <= indexRow + 1; i++){
            const rowArray = [];
            //Si es negativo es la ultima, y sino es el modulo entre el index y la cant de filas.
            const realRow = i < 0 ? this.levelGrid.length-1 : i % this.levelGrid.length;
            for (let y = indexColumn - 1; y <= indexColumn + 1; y++ ){
                //Simil row pero para columna
                const realColumn = y < 0 ? this.levelGrid[realRow].length-1 : y % this.levelGrid[realRow].length;
                rowArray.push(this.levelGrid[realRow][realColumn]);
            }
            matrix.push(rowArray);
        }
        return matrix;
    }

    getNinePerNineGridFinite(indexRow, indexColumn){
        const matrix = [];
        const celda_vacia = {
            "filled": false,
        }
        for (let i = indexRow - 1; i <= indexRow + 1; i++){
            //Casos Filas Imaginarias vacías
            if (i < 0 || i === this.levelGrid.length){
                matrix.push([celda_vacia, celda_vacia, celda_vacia]);
            }else{
                const rowArray = [];
                for (let y = indexColumn - 1; y <= indexColumn + 1; y++ ){
                    if (y < 0 || y === this.levelGrid[i].length){
                        rowArray.push(celda_vacia);
                    }else{
                        rowArray.push(this.levelGrid[i][y]);
                    }
                }
                matrix.push(rowArray);
            }
        }
        return matrix;
    }

    /* Example:
        | | | | | | | |
        | | | x x x | |
        | | | x Y x | |
        | | | x x x | |
        | | | | | | | |
    */
    defineTypeOfStreet(row, column){
        const ninePerNineGrid = this.getNinePerNineGrid(row, column);
        let typeDefined = false;
        let typeResult = undefined;
        for ( let i = 0; i < TYPES_OF_STREETS.length && !typeDefined; i++){
            typeDefined = TYPES_OF_STREETS[i].isValidNinePerNineGrid(ninePerNineGrid);
            typeResult = TYPES_OF_STREETS[i];
        }
        if (!typeDefined){
            throw new Error("No se pudo definir el tipo de calle dentro de los tipos validos.");
        }
        //Row 0 es la de abajo del todo. Invertimos la row.
        return new typeResult(ninePerNineGrid, this.levelGrid.length - 1 - row, column);
    }


    linkStraightStreets(straightStreetsArray){
        return straightStreetsArray;
        //Hacer las conjunciones
    }
    
}