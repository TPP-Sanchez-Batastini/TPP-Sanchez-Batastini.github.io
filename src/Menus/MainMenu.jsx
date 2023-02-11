import React from 'react';
import { useNavigate } from "react-router-dom";


const styleMenu = {
  width:"100vw", 
  height:"100vh", 
  backgroundImage:`url("DrivingSimMenuNoTitle.png")`, 
  backgroundSize:"cover", 
  backgroundRepeat: "no-repeat"
}


export const MainMenu = () => {

  const navigate = useNavigate()

  return (
    <>
      <div style={styleMenu}>
        <div id="button-box" style={{position:"absolute", top:"5%", right:"5%"}}>
          <div className={"MainMenuTitle"}>
            <h1 style={{textAlign:"center", fontSize:"7rem"}}>
              Driving<br/>Simulator
            </h1>
          </div>
          <div className={"buttonWrapperMainMenu"}>
            <button 
              className={"buttonMainMenu"}
              onClick={() => navigate("/scene")}
            >
              Iniciar
            </button>
          </div>
          <div className={"buttonWrapperMainMenu"}>
          <button 
              className={"buttonMainMenu"}
              onClick={() => navigate("/level-editor")}
            >
              Editor de Niveles
            </button>
          </div>
          <div className={"buttonWrapperMainMenu"}>
            <button 
              className={"buttonMainMenu"}
              onClick={() => navigate("/configs")}
            >
              Configuración
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
