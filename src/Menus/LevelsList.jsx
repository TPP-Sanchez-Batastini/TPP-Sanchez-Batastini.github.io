import React from 'react';
import { Button, Grid } from '@mui/material';
import { LevelsSelectionGrid } from './Components/LevelsSelectionGrid';
import { LoginButton } from './Components/LoginButton';
import "./styles.css";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";

export const LevelsList = () => {

  const navigate = useNavigate();

  return (
    <div className='background'>
      <Grid container spacing={2} rowSpacing={2} sx={{marginTop:0}}>
        <Grid item xs={12} style={{textAlign:"center"}}>
            <h1 style={{fontSize:64}}>Seleccionar Nivel</h1>
        </Grid>
      </Grid>
      <Grid container spacing={2} rowSpacing={2} justifyContent={"center"}>
        <Grid item xs={12} md={4} className={"back_button"}>
          <Button onClick={() => {navigate("/");}} startIcon={<ArrowBackIosNewIcon />} className={"accept_button"}>
            ATR&Aacute;S
          </Button>
        </Grid>
        <Grid item xs={12} md={8} style={{textAlign:"center"}}>
          <LoginButton/>
        </Grid>
      </Grid>
      <Grid container spacing={2} rowSpacing={2}>
        <Grid item xs={12}>
            <LevelsSelectionGrid />
        </Grid>
      </Grid>
    </div>
  )
}
