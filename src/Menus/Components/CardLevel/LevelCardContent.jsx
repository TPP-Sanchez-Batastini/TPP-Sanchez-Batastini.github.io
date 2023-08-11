import { CardContent, CardHeader, CardMedia, Grid, Typography } from '@mui/material'
import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import SportsScoreIcon from '@mui/icons-material/SportsScore';

export const LevelCard = ({level}) => {

  return (
    <CardContent style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", width:"100%"}}>
        <CardMedia
         component="img"
         width={400}
         height={200}
         image={`/levels/images/${level.image}`}
         title={level.title}
         sx={{ objectFit: "contain", justifyContent: "center", display: "flex", maxHeight:"100%", maxWidth:"100%" }}
        />
        <CardHeader
            title={level.title}
            subheader={level.description}
            style={{width:"100%", height:150, marginBottom:10, paddingBottom:0, paddingTop:0}}
        />
        <Grid container spacing={2} rowSpacing={2} justifyContent={"space-around"} alignItems="center" alignContent="center" style={{height:90}}>
          <Grid item xs={12} md={4}>
            {/*Completado o pendiente*/}
            <Typography style={{color:"green", fontWeight:"bold"}}>
              <CheckCircleIcon style={{color:"green", verticalAlign:"middle", marginRight:10}}/>
              COMPLETADO
            </Typography>
            <Typography style={{color:"red", fontWeight:"bold"}}>
              <CancelIcon style={{color:'red', verticalAlign:"middle", marginRight:10}}/>
              PENDIENTE
            </Typography>

          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>
              <AccessTimeFilledIcon style={{verticalAlign:"middle", marginRight:10}}/>
              <strong>Mejor tiempo:</strong> 00:00:00.0000
            </Typography>
            
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>
              <SportsScoreIcon style={{verticalAlign:"middle", marginRight:10}}/>
              <strong>Mejor puntaje:</strong> 000000
            </Typography>
          </Grid>
        </Grid>
    </CardContent>
  );
}
