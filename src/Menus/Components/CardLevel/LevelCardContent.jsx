import { CardContent, CardHeader, CardMedia, Grid, Typography, Button, Box } from '@mui/material'
import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import { useNavigate } from "react-router-dom";
import CarRentalIcon from '@mui/icons-material/CarRental';
import "../../styles.css";

export const LevelCard = ({level}) => {

  const navigate = useNavigate();

  const seleccionarNivel = () => {
    navigate("/scene", { state: { jsonLevel: level } });
  }

  return (
    <CardContent style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", width:"100%"}}>
      <CardMedia
        component="img"
        width={400}
        height={200}
        image={`/levels/images/${level.image}`}
        title={level.title}
        style={{ borderRadius:20}}
        sx={{ objectFit: "contain", justifyContent: "center", display: "flex", maxHeight:"100%", maxWidth:"100%"}}
      />
      <Grid container spacing={2} rowSpacing={2} justifyContent={"space-around"} alignItems="center" alignContent="center" className={"card_text_wrapper"}>
        <Grid item xs={12} sm={9} style={{padding:0}}>
          <CardHeader 
            title={level.title}
            subheader={level.description}
            style={{ padding:0}}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box>
            <Typography style={{color:"green", fontWeight:"bold"}}>
              <CheckCircleIcon style={{color:"green", verticalAlign:"middle", marginRight:10}}/>
              COMPLETADO
            </Typography>
            <Typography style={{color:"red", fontWeight:"bold"}}>
              <CancelIcon style={{color:'red', verticalAlign:"middle", marginRight:10}}/>
              PENDIENTE
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Typography>
            <AccessTimeFilledIcon style={{verticalAlign:"middle", marginRight:10}}/>
            <strong>Mejor tiempo:</strong> 
          </Typography>
          <Typography>
            00:00:00.0000
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography>
            <SportsScoreIcon style={{verticalAlign:"middle", marginRight:10}}/>
            <strong>Mejor puntaje:</strong>
          </Typography>
          <Typography>
            000000
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} style={{textAlign:"center"}}  >
          <Button startIcon={<CarRentalIcon />} onClick={seleccionarNivel} className={"accept_button"}>
            PRACTICAR
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  );
}
