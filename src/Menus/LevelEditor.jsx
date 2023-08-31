import React from 'react'
import { IconButton } from '@mui/material'
import { ConfigDrawer } from './Components/ConfigDrawer';
import { ItemsDrawer } from './Components/ItemsDrawer';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import { ItemsContext } from './LevelEditorContext/ItemsContext';
import { useState } from 'react';
import { InputsGrid } from './Components/InputsGrid';

import { LevelGrid } from './Components/LevelGrid';

export const LevelEditor = () => {

  const [openItems, setOpenItems] = useState(false);
  const [openConfigs, setOpenConfigs] = useState(false);

  const [itemsInGrid, setItemsInGrid] = useState([]);

  const [lastSelectedItem, setLastSelectedItem] = useState(null);

  const [gridDimensions, setGridDimensions] = useState({width:20, height:20});

  React.useEffect(() => {
    if (lastSelectedItem !== null){
      setItemsInGrid(currentItems => [...currentItems, lastSelectedItem]);
    }
  }, [lastSelectedItem]);

  return (
    <>
      <ItemsContext.Provider value={{lastSelectedItem, setLastSelectedItem}} >
        <div style={{backgroundColor: "#B1E6F2", minHeight:'100vh'}} >
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
              {itemsInGrid.map((item, idx) => {
                return(
                  <span key={idx}></span>
                  /*<img 
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
                  />*/
                );
              })}
          </div>
          
        </div>
        <ItemsDrawer openItems={openItems} handleDrawerClose={() => {setOpenItems(false)}}/>
        <ConfigDrawer openConfigs={openConfigs} handleDrawerClose={() => {setOpenConfigs(false)}}/>
      </ItemsContext.Provider>
    </>
  );
}
