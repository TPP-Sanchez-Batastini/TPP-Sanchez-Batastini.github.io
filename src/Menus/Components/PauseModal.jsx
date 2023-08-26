import { Box, Modal, Button, Tab, CardMedia, Grid, Typography,Item, Switch, FormControlLabel } from '@mui/material';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { TabContext, TabList, TabPanel } from "@mui/lab";
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';
import Slider from '@mui/material/Slider';

const calidadEspejos = [
  {
    value: 0,
    label: 'Desactivado',
  },
  {
    value: 1,
    label: 'Baja',
  },
  {
    value: 2,
    label: 'Media',
  },
  {
    value: 3,
    label: 'Alta',
  },
];
const resolucion = [

  {
    value: 1,
    label: 'Baja',
  },
  {
    value: 2,
    label: 'Media',
  },
  {
    value: 3,
    label: 'Alta',
  },
];

const resolucionVR = [
  {
    value: 0,
    label: 'X0.25',
  },
  {
    value: 1,
    label: 'X0.50',
  },
  {
    value: 2,
    label: 'X0.75',
  },
  {
    value: 3,
    label: 'X1',
  },
];



function valueLabelFormat(marks,value) {
  
  return calidadEspejos[value].label;
}


export const PauseModal = ({pausedLevel, pause}) => {

  const [openModal, setOpenModal] = React.useState(pausedLevel);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = React.useState("joystick");

  React.useEffect(() => {
    setOpenModal(pausedLevel);

  }, [pausedLevel]);
  
  const reloadTab = () => {
    window.location.reload();
  }

  const backToMenu = () => {
    navigate("/levels");
  }
  const handleChange = (event, newTab) => {
    setSelectedTab(newTab);
  };
   
  return (
    <Modal open = {openModal ? openModal : false} >
      <Box className={"pause_menu"}>
        <h1>
          Pausa
        </h1> 
        <TabContext value={selectedTab} variant="fullWidth" scrollButtons="auto">
          <Box>
            <TabList scrollButtons="auto" variant="fullWidth" onChange={handleChange} aria-label="pause-tabs">
              <Tab label="Cómo manejar con Joystick" value={"joystick"} wrapped/>
              <Tab label="Cómo manejar con volante" value={"volante"} wrapped/>
              <Tab label="Cónfiguracion Grafica" value={"graficos"} wrapped/>
            </TabList >
          </Box>
        
          <TabPanel value={"joystick"}>
            <CardMedia
              component="img"
              width={"100%"}
              height={"100%"}
              image={`/controlesJoystick.png`}
              
              style={{ borderRadius:20}}
              sx={{ objectFit: "contain", justifyContent: "center", display: "flex", maxHeight:"100%", maxWidth:"100%"}}
            />
          </TabPanel>
          <TabPanel value={"volante"}>
          <CardMedia
              component="img"
              width={"100%"}
              height={"100%"}
              image={`/controlesVolante.png`}
              style={{ borderRadius:20}}
              sx={{ objectFit: "contain", justifyContent: "center", display: "flex", maxHeight:"100%", maxWidth:"100%"}}
            />
          </TabPanel>
          <TabPanel value={"graficos"}>

          <Grid container 
  direction="row"
  justifyContent="center"
  alignItems="center">
  <Grid item  xs={8}>
        <Typography id="input-slider" gutterBottom>
              Calidad Espejos
        </Typography>
          <Slider
            defaultValue={2}
            marks={calidadEspejos}
            max={3}
          />
  </Grid>
  <Grid item  xs={8}>
        <Typography id="input-slider" gutterBottom>
              Resolución
        </Typography>
          <Slider
            defaultValue={2}
            marks={resolucion}
            max={3}
            min={1}
          />
  </Grid>
  <Grid item  xs={8}>
        <Typography id="input-slider" gutterBottom>
              Resolución Vr
        </Typography>
          <Slider
            defaultValue={2}
            marks={resolucionVR}
            max={3}
          />
  </Grid>
  <Grid item  xs={8}>
        <Typography id="input-slider" gutterBottom>
               Distancia de visión (metros)
        </Typography>
          <Slider
            valueLabelDisplay="auto"
            defaultValue={50}
            max={300}
          />
  </Grid>
  <Grid item  xs={8}>
  <FormControlLabel
          control={
            <Switch label=""  defaultChecked />
          }
          label="Activar luces vehiculos"
        />

    
  </Grid>
  
  

</Grid>
            {/* <Grid xs={5}>
            
            </Grid> */}
          </TabPanel>

        </TabContext>
        <Grid container justifyContent={"space-around"} alignItems={"center"}>
          <Grid item xs={12} md={4} style={{textAlign:"center"}}>
            <Box style={{textAlign:"center", margin:"auto"}}>
              <Button onClick={backToMenu} color="error" variant="contained">
                Volver al menu
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} style={{textAlign:"center"}}>
            <Box style={{textAlign:"center", margin:"auto"}}>
              <Button onClick={reloadTab} variant="outlined" color="error">
                Reintentar
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} style={{textAlign:"center"}}>
            <Box style={{textAlign:"center", margin:"auto"}}>
              <Button onClick={pause} variant="contained">
                Seguir
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}
