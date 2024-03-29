import { Box, Modal, Button, Tab, CardMedia, Grid } from '@mui/material';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { ConfigGrafics } from './ConfigGrafics';

export const PauseModal = ({pausedLevel, pause}) => {

  const [openModal, setOpenModal] = React.useState(pausedLevel ? pausedLevel : false);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = React.useState("joystick");

  React.useEffect(() => {
    if (pausedLevel !== undefined && pausedLevel !== null)
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
    <Modal open = {openModal}>
      <Box className={"pause_menu"}>
        <h1>
          Pausa
        </h1> 
        <TabContext value={selectedTab} variant="fullWidth" scrollButtons="auto">
          <Box>
            <TabList scrollButtons="auto" variant="fullWidth" onChange={handleChange} aria-label="pause-tabs">
              <Tab label="Cómo manejar con Joystick" value={"joystick"} wrapped/>
              <Tab label="Cómo manejar con volante" value={"volante"} wrapped/>
              <Tab label="Configuración" value={"config"} wrapped/>
            </TabList >
          </Box>
          <Box sx={{ overflowY: "scroll", maxHeight: "50vh" }}>
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
            <TabPanel value={"config"}>
              <ConfigGrafics/>
            </TabPanel>
            <Grid container justifyContent={"space-around"} alignItems={"center"} rowSpacing={2}>
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
        </TabContext>
        
      </Box>
      
    </Modal>
  )
}
