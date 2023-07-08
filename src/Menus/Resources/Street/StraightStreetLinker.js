export class StraightStreetLinker{

    constructor(arrayOfStreets){
        this.sections = this.segregateSections(arrayOfStreets);
        this.sectionsAsJSON = this.linkSections();
    }

    //Genero un array para cada tramo recto, que contenga todas las StraightStreets de ese tramo
    //Cada array de seccion va dentro de un array general y eso retornamos
    segregateSections(arrayOfStreets){
        // Recorro array de streets --> Armo un hashMap de filas, y otro de columnas.
        // Para cada fila o columna, separar las subsecciones correspondientes.
        const rows = {};
        const cols = {};
        let sectionsArray = [];

        for(let i = 0; i < arrayOfStreets.length; i++){
            let [streetRow, streetCol] = arrayOfStreets[i].getPositionAsRowAndColumn();
            if( arrayOfStreets[i].isHorizontal() ){
                if( !(streetRow in rows) ){
                    rows[streetRow] = [];
                }
                rows[streetRow].push({"idx":streetCol, "street":arrayOfStreets[i]});
            }
            else{
                if( !(streetCol in cols) ){
                    cols[streetCol] = [];
                }
                cols[streetCol].push({"idx":streetRow, "street":arrayOfStreets[i]});
            }
        }
        for(const [, value] of Object.entries(rows)){
            sectionsArray = [...sectionsArray, ...this.generateArraySubsections(value)];
        }
        for(const [, value] of Object.entries(cols)){
            sectionsArray = [...sectionsArray, ...this.generateArraySubsections(value)];
        }
        return sectionsArray;
        
    }


    generateArraySubsections(array){
        const finalArray = [];
        //Sort de array por idx creciente... CREEMOS que ya viene sorteado - VERIFICAR.
        for ( let i=0; i<array.length; i++){
            //Primer elemento, o no son lindantes
            if( i === 0 || (array[i]["idx"] - array[i-1]["idx"] > 1)){
                finalArray.push([array[i]["street"]]);
            }else{
                finalArray[finalArray.length - 1].push(array[i]["street"]);
            }
        }
        return finalArray;
    }


    linkSections(){
        const sectionsJSON = [];
        for(let i = 0; i < this.sections.length; i++){
            //Rotation is the same for all of them
            const jsonForStreet = {
                "position_x": this.sections[i].reduce((acum, elem) => acum + elem.getPositionX(), 0)/this.sections[i].length,
                "position_y": this.sections[i].reduce((acum, elem) => acum + elem.getPositionY(), 0)/this.sections[i].length,
                "rotation": this.sections[i][0].rotation,
                "long_x": this.sections[i][0].isHorizontal() ? this.sections[i].reduce((acum, elem) => acum + elem.getLongX(), 0) : this.sections[i][0].getLongX(),
                "long_y": !this.sections[i][0].isHorizontal() ? this.sections[i].reduce((acum, elem) => acum + elem.getLongY(), 0) : this.sections[i][0].getLongY(),
                "type": "STRAIGHT"
            }
            sectionsJSON.push(jsonForStreet);
        }
        return sectionsJSON;
    }

    getSectionsAsJSON(){
        return this.sectionsAsJSON;
    }
}