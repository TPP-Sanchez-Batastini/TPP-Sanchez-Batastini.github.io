import React from 'react'
import { Grid, Container, Typography, Button, IconButton } from '@mui/material'
import { ConfigDrawer } from './Components/ConfigDrawer';
import { ItemsDrawer } from './Components/ItemsDrawer';
import SettingsIcon from '@mui/icons-material/Settings'
import AddIcon from '@mui/icons-material/Add';

const MAX_WIDTH = 4000;
const MAX_HEIGHT = 4000;

const MAX_WIDTH_INPUT = 3000;
const MAX_HEIGHT_INPUT = 3000;


export const LevelEditor = () => {

  const [openItems, setOpenItems] = React.useState(false);
  const [openConfigs, setOpenConfigs] = React.useState(false);
  const [widthGrid, setWidthGrid] = React.useState(200);
  const [heightGrid, setHeightGrid] = React.useState(200);

  return (
    <>
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
            <div 
              className="level-grid"
              style={{
                backgroundSize: `${parseInt(25 - widthGrid*100/(MAX_WIDTH*4))}% ${parseInt(25 - heightGrid*100/(MAX_HEIGHT*4))}%`}}
            >

            </div>
        </div>
        
      </div>
      <ItemsDrawer openItems={openItems} handleDrawerClose={() => {setOpenItems(false)}}/>
      <ConfigDrawer openConfigs={openConfigs} handleDrawerClose={() => {setOpenConfigs(false)}}/>
    </>
  );
}
