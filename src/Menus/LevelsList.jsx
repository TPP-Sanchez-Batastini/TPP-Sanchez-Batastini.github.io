import React from 'react'
import { Grid } from '@mui/material'
import { LevelsSelectionGrid } from './Components/LevelsSelectionGrid'

export const LevelsList = () => {
  return (
    <Grid container spacing={2} rowSpacing={2}>
        <Grid item xs={12} style={{textAlign:"center"}}>
            <h1>Driving Simulator - Seleccionar Nivel</h1>
        </Grid>
        <Grid item xs={12} alignContent="center" justifyContent="center" style={{textAlign:"center"}}>
            <img src="logo_transp.png" width="150" alt="Driving Simulator Logo"/>
        </Grid>
        <Grid item xs={12}>
            <LevelsSelectionGrid />
        </Grid>
    </Grid>
  )
}
