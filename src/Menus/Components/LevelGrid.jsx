import { useEffect, useState } from 'react';

const COLORS = {
  "FILLED": "darkgray",
  "EMPTY": "white"
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
    console.log(gridDimensions);
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
  }, [])

  const onEnterHoverWithClickCell = (row, col) => {
    if(click){
      const levelGridCopy = [...levelGrid];
      const cell = levelGrid[row][col];
      levelGridCopy[row][col].filled = true;
      levelGridCopy[row][col].div_color = COLORS["FILLED"];
      setLevelGrid(levelGridCopy);
    }else if(rightClick){
      const levelGridCopy = [...levelGrid];
      const cell = levelGrid[row][col];
      levelGridCopy[row][col].filled = false;
      levelGridCopy[row][col].div_color = COLORS["EMPTY"];
      setLevelGrid(levelGridCopy);
    }
  };

  const onClickCell = (row, col, btn_click) => {
    if(btn_click === LEFT_CLICK){
      const levelGridCopy = [...levelGrid];
      const cell = levelGrid[row][col];
      levelGridCopy[row][col].filled = true;
      levelGridCopy[row][col].div_color = COLORS["FILLED"];
      setLevelGrid(levelGridCopy);
    }else if(btn_click === RIGHT_CLICK){
      const levelGridCopy = [...levelGrid];
      const cell = levelGrid[row][col];
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
    </div>
  );
}