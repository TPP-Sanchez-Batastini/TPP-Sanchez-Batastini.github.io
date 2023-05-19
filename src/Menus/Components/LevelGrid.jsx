import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import { downloadObjectAsJson, validateGrid, generateJSONFromGrid } from '../Resources/LevelEditor';

const COLORS = {
  "FILLED": "darkgray",
  "EMPTY": "white",
  "WARNING": 'orange',
};

const WIDTH_GRID_VIEW = 600;
const HEIGHT_GRID_VIEW = 600;
const LEFT_CLICK = 0;
const RIGHT_CLICK = 2;


export const LevelGrid = ({gridDimensions}) => {

  const [levelGrid, setLevelGrid] = useState([]);
  const [click, setClick] = useState(false);
  const [rightClick, setRightClick] = useState(false);

  useEffect(() => {
    let finalGrid = [];
    for(let i=0; i<gridDimensions.height; i++){
      let currentRow = [];
      for(let j=0; j<gridDimensions.width; j++){
        let newCell = {
          "filled": false,
          "div_color": COLORS["EMPTY"]
        }
        currentRow.push(newCell);
      }
      finalGrid.push(currentRow);
    }
    setLevelGrid(finalGrid);
  }, [gridDimensions.width, gridDimensions.height]);


  useEffect(() => {
    window.addEventListener("mouseup", (event) => {
      event.preventDefault();
      if(event.button === LEFT_CLICK){
        setClick(false);
      }else if (event.button === RIGHT_CLICK){
        setRightClick(false);
      }
    });
    window.addEventListener("contextmenu", (event) => { event.preventDefault(); });
  }, []);


  const arrayContains = (array, insiderArray) => {
    if (!insiderArray || !array){
      return false;
    }
    for (let i=0; i<array.length; i++){
      let equals = true;
      for (let j=0; j<array[i].length; j++){
        try{
          if(array[i][j] != insiderArray[j]){
            equals = false;
          }
        }catch(exc){j=array[i].length; equals=false;}
      }
      if(equals) return true;
    }
    return false;
  }


  const onSubmitLevel = () =>{
    let result = validateGrid(levelGrid);
    let vec_aux = [...levelGrid];
    for( let i=0; i< levelGrid.length; i++ ){
      for( let j=0; j < levelGrid[i].length; j++){
        if (vec_aux[i][j].filled){
          vec_aux[i][j].div_color = arrayContains(result.wrongCells, [i,j]) ? COLORS["WARNING"] : COLORS["FILLED"];
        }
        
      }
    }
    setLevelGrid(vec_aux);
    if (result.valid) {
      //downloadObjectAsJson(generateJSONFromGrid(levelGrid), "Driving_Simulator_Custom_Level.json");
    }
    
  }


  const onEnterHoverWithClickCell = (row, col) => {
    if(click){
      const levelGridCopy = [...levelGrid];
      levelGridCopy[row][col].filled = true;
      levelGridCopy[row][col].div_color = COLORS["FILLED"];
      setLevelGrid(levelGridCopy);
    }else if(rightClick){
      const levelGridCopy = [...levelGrid];
      levelGridCopy[row][col].filled = false;
      levelGridCopy[row][col].div_color = COLORS["EMPTY"];
      setLevelGrid(levelGridCopy);
    }
  };

  
  const onClickCell = (row, col, btn_click) => {
    if(btn_click === LEFT_CLICK){
      const levelGridCopy = [...levelGrid];
      levelGridCopy[row][col].filled = true;
      levelGridCopy[row][col].div_color = COLORS["FILLED"];
      setLevelGrid(levelGridCopy);
    }else if(btn_click === RIGHT_CLICK){
      const levelGridCopy = [...levelGrid];
      levelGridCopy[row][col].filled = false;
      levelGridCopy[row][col].div_color = COLORS["EMPTY"];
      setLevelGrid(levelGridCopy);
    }
  };


  return (
    <div 
      style={{
        width: WIDTH_GRID_VIEW,
        height: HEIGHT_GRID_VIEW,
        marginTop: 25,
        marginLeft: "auto",
        marginRight: "auto",
      }}
      onMouseDown = {(event) => {
        event.preventDefault();
        if(event.button === LEFT_CLICK){
          setClick(true);
        }else if (event.button === RIGHT_CLICK){
          setRightClick(true);
        }
      }}
    >
      {levelGrid.map((row, idx_row) => {
        return(
          <div 
            className="row-level-grid" 
            id={`row_${idx_row}`}
            key={`row_${idx_row}`}
            style={{
              width: "100%",
              height: HEIGHT_GRID_VIEW/gridDimensions.height,
              display: "flex",
              flexDirection: "row"
            }}
          >
            {row.map((cell, idx_col) => {
              return (
                <div 
                  className="cell-level-grid" 
                  key={`cell_${idx_row}_${idx_col}`}
                  id={`cell_${idx_row}_${idx_col}`} 
                  style={{
                    backgroundColor: cell["div_color"],
                    width: `${100/gridDimensions.width}%`,
                    height: "100%",
                    border: "1px solid black"
                  }} 
                  //onMouseEnter = {() => onEnterHoverWithClickCell(idx_row, idx_col)}
                  onMouseMove = {(event) => {
                    event.preventDefault();
                    onEnterHoverWithClickCell(idx_row, idx_col);
                  }}
                  onMouseUp = {(event) => {
                    onClickCell(idx_row, idx_col, event.button);
                  }}
                  
                />
              );
            })}
          </div>
        );
      })}
      <div style={{display:"flex", justifyContent:"center", marginTop:40}}>
        <Button variant="contained" onClick={onSubmitLevel}  color="success">
          <MemoryIcon/> Procesar nivel...
        </Button>
      </div>
    </div>
  );
}