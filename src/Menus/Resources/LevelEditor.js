export function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};




function getCountSidesPainted(levelGrid, i, j){
    let aux = 0;
    for (let x = i-1; x <= i+1 && x < levelGrid.length; x++){
        if (x >= 0 && x != i){
            aux += levelGrid[x][j].filled ? 1 : 0;
        }
    }
    for(let y = j-1; y <= j+1 && y < levelGrid[i].length; y++){
        if(y >= 0 && y != j){
            aux += levelGrid[i][y].filled ? 1 : 0;
        }
    }
    console.log(aux)
    return aux;
}

function validateGridNotInfinite(levelGrid){
    let valid = true;
    let wrongCells = [];
    for (let i=0; i<levelGrid.length; i++){
        for (let j=0; j<levelGrid[i].length; j++){
            if (levelGrid[i][j].filled && getCountSidesPainted(levelGrid, i,j) <= 1){
                valid = false;
                wrongCells.push([i,j]);
            }
        }
    }
    
    return {
        "valid": valid,
        "wrongCells": wrongCells
    }
}

function validateGridInfinite(){

}

export function validateGrid(levelGrid, isInfinite){
    
    return (isInfinite ? validateGridInfinite(levelGrid) : validateGridNotInfinite(levelGrid));
    
}


function definirRotacion(levelGrid, i, j){
    let aux = 0;
    let rotation= 0;
    //recta horizontal
    if(levelGrid[i+1][j].filled && levelGrid[i-1][j].filled){
        aux += 2;
        rotation = 0;
    }
    // recta vertical
    if(levelGrid[i][j+1].filled && levelGrid[i][j-1].filled){
        aux += 2;

        rotation = Math.PI/2;
    }

    if(levelGrid[i][j+1].filled){
        aux += 1;
        rotation = 0;
    }
    if(levelGrid[i][j-1].filled){
        aux += 1;
        rotation = 0;
    }

    ///////////////
    if(levelGrid[i][j+1].filled && levelGrid[i][j-1].filled && levelGrid[i+1][j].filled && levelGrid[i-1][j].filled){
        // bocacalle
    }else{

    }

    console.log(aux)
    return [aux, direction];
}

function defineTipe(){
    
}

export function generateJSONFromGrid(levelGrid){
    for (let i=0; i<levelGrid.length; i++){
        for (let j=0; j<levelGrid[i].length; j++){
            if (levelGrid[i][j].filled && getCountSidesPainted(levelGrid, i,j) <= 1){
                valid = false;
                wrongCells.push([i,j]);
            }
        }
    }

    
}