import { Box, Modal, But, Buttonton, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from "react-router-dom";

export const EndOfLevelModal = ({endLevel, score, time, minScore}) => {

  const [openModal, setOpenModal] = React.useState(endLevel);
  const navigate = useNavigate();

  React.useEffect(() => {
    setOpenModal(endLevel);
    if(endLevel){
      console.log("TODO: Post to API: Submit LEVEL if user is logged in");
    }
  }, [endLevel]);
  
  const reloadTab = () => {
    window.location.reload();
  }

  const backToMenu = () => {
    navigate("/levels");
  }
   
  return (
    <Modal open = {openModal} >
        <Box className={"end_of_level_dialog"}>
          {
            minScore>score ? 
              <>
                <h1>Nivel Fallido</h1>
                <p style={{color:"red"}}>El puntaje m&iacute;nimo para pasar el nivel es de: {minScore}, y tu puntaje fue de: {score}</p>
              </> :
              <>
                <h1>
                  ¡Nivel Superado!
                </h1> 
                <p style={{color:"green"}}><strong>Tu punta final es</strong>: {score}</p>
              </>
          }
          
          <p><strong>Tiempo transcurrido:</strong> {time}</p>
          <Button onClick={reloadTab}>
                Reintentar
            </Button>
            <Button onClick={backToMenu}>
                Volver al menu
            </Button>
        </Box>


    </Modal>
  )
}
