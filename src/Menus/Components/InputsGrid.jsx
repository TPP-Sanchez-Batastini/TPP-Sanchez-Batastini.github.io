import React from 'react'
import {useState} from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const MAX_WIDTH_INPUT = 40;
const MAX_HEIGHT_INPUT = 40;

export const InputsGrid = ({setGridDimensions, gridDimensions}) => {
    const [InputWidth, setInputWidth] = useState(gridDimensions.width);
    const [InputHeight, setInputHeight] = useState(gridDimensions.height);

    const onSubmit = () =>{
      setGridDimensions(
        {
          width: InputWidth, 
          height: InputHeight
        }
      );
    }
  return (
    <Grid container  direction="row" width={"80%"} marginLeft={'10%'}
    justifyContent="space-evenly"
    alignItems="center" spacing={2}>
        <Grid item xs={2}>
        <p>Ancho:</p>
          <input 
            value={InputWidth} 
            type="number" 
            step="1" 
          onChange={
              (event) => {
                let value = parseInt(event.target.value.replaceAll(",","").replaceAll(".",""));
                setInputWidth(value > MAX_WIDTH_INPUT ? MAX_WIDTH_INPUT : value);
              }
        } 
          />
        </Grid>
        
        <Grid item xs={2}>
          <div>
            <p>Alto:</p>
            <input 
              value={InputHeight} 
              type="number" 
              step="1" 
              onChange={
                (event) => {
                  let value = parseInt(event.target.value.replaceAll(",","").replaceAll(".",""));
                  setInputHeight(value > MAX_HEIGHT_INPUT ? MAX_HEIGHT_INPUT : value);
                  
                }
              }
            />
          </div>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={onSubmit}>Actualizar</Button>
        </Grid>
    </Grid>
    
  )
}
