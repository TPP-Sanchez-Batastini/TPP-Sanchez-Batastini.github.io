import React from 'react'
import { Grid, Container, Typography, Button, IconButton } from '@mui/material'
import { ConfigDrawer } from './Components/ConfigDrawer';
import { ItemsDrawer } from './Components/ItemsDrawer';
import SettingsIcon from '@mui/icons-material/Settings';
import MemoryIcon from '@mui/icons-material/Memory';
import AddIcon from '@mui/icons-material/Add';
import { ItemsContext } from './LevelEditorContext/ItemsContext';
import { useState } from 'react';
import { InputsGrid } from './Components/InputsGrid';

import { LevelGrid } from './Components/LevelGrid';

const MAX_WIDTH = 4000;
const MAX_HEIGHT = 4000;

const MAX_WIDTH_INPUT = 3000;
const MAX_HEIGHT_INPUT = 3000;


export const LevelEditor = () => {

  const [openItems, setOpenItems] = useState(false);
  const [openConfigs, setOpenConfigs] = useState(false);

  const [itemsInGrid, setItemsInGrid] = useState([]);

  const [lastSelectedItem, setLastSelectedItem] = useState(null);

  const [gridDimensions, setGridDimensions] = useState({width:20, height:20});

  const setGridWidth = (NewWidth)=>{
    setGridDimensions({...gridDimensions,width: NewWidth})
  };
  const setGridHeight = (NewHeight)=>{
    setGridDimensions({...gridDimensions,height: NewHeight})
  };
  React.useEffect(() => {
    if (lastSelectedItem !== null){
      setItemsInGrid([...itemsInGrid, lastSelectedItem]);
    }
    console.log(itemsInGrid);
  }, [lastSelectedItem]);

  return (
    <>
      <ItemsContext.Provider value={{lastSelectedItem, setLastSelectedItem}}>
        <div>
          <div style={{flexDirection:'row',justifyContent:'space-between', display:"flex"}}>
            <IconButton onClick={() => setOpenItems(true)} style={{height:40, margin:10}} className='header'>
              <AddIcon/>
            </IconButton>
            <h1>Driving Simulator - Level Editor</h1>
            <IconButton onClick={() => setOpenConfigs(true)} style={{height:40, margin:10}} className='header' >
              <SettingsIcon/>
            </IconButton>
          </div>
          <div>
              <InputsGrid setGridDimensions={setGridDimensions} gridDimensions={gridDimensions}></InputsGrid>
              <LevelGrid gridDimensions = {gridDimensions}/>
              {/*itemsInGrid.map((item, idx) => {
                return(
                  <img 
                    key={idx} 
                    src={`${item.selectedItem}.png`} 
                    width={item.scale*75} 
                    height={item.scale*75} 
                    style={{
                      top:item.positionY, 
                      left:item.positionX,
                      position: "absolute",
                      zIndex: item.zIndex.toString()
                    }}
                    onClick={() => {console.log(`OPEN CONFIGS OF idx: ${idx}, obj: ${JSON.stringify(itemsInGrid[idx])}`)}}
                  />
                );
              })*/}
          </div>
          <div style={{display:"flex", justifyContent:"center", marginTop:40}}>
            <Button variant="contained" color="success">
              <MemoryIcon/> Procesar nivel...
            </Button>
          </div>
          
        </div>
        <ItemsDrawer openItems={openItems} handleDrawerClose={() => {setOpenItems(false)}}/>
        <ConfigDrawer openConfigs={openConfigs} handleDrawerClose={() => {setOpenConfigs(false)}}/>
      </ItemsContext.Provider>
    </>
  );
}
