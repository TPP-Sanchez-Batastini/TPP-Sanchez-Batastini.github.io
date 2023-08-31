import React from 'react';
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import './styles.css'

const styleMenu = {
  width:"100vw", 
  height:"100vh", 
  backgroundImage:`url("DrivingSimMenuNoTitle.png")`, 
  backgroundSize:"cover", 
  backgroundRepeat: "no-repeat",
  backgroundColor: "#B1E6F2"
}


export const MainMenu = () => {

  const navigate = useNavigate()

  return (
    <>
      <div style={styleMenu}>
        <Grid 
          container 
          rowSpacing={2} 
          justifyContent="center"
          alignItems={"center"} 
          flexDirection={"column"} 
          className={"containerMainMenu"}
        >
          <Grid item xs={12} className={"MainMenuTitle"}>
            <h1 className={"titleMainMenu"}>
              Driving<br/>Simulator
            </h1>
          </Grid>
          <Grid item xs={12} className={"buttonWrapperMainMenu"}>
            <button 
              className={"buttonMainMenu"}
              onClick={() => navigate("/levels")}
            >
              Iniciar
            </button>
          </Grid>
          <Grid item xs={12} className={"buttonWrapperMainMenu"}>
          <button 
              className={"buttonMainMenu"}
              onClick={() => navigate("/level-editor")}
            >
              Editor de Niveles
            </button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
