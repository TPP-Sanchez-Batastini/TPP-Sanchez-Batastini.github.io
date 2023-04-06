import React from 'react'
import {useState} from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

export const InputsGrid = ({setGridDimensions, gridDimensions}) => {
    const [InputWidth, setInputWidth] = useState(gridDimensions.width);
    const [InputHeight, setInputHeight] = useState(gridDimensions.height);

    const onSubmit = () =>{
        console.log(InputWidth);
        console.log(InputHeight);
        setGridDimensions({width: InputWidth, height: InputHeight});
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
              (event) => setInputWidth(parseInt(event.target.value.replaceAll(",","").replaceAll(".","")))
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
                (event) => setInputHeight(parseInt(event.target.value.replaceAll(",","").replaceAll(".","")))
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
