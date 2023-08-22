import { Box, Modal, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { SessionContext } from '../Sessions/SessionContext';
import {API_URL} from '../Constants/Constants'

export const EndOfLevelModal = ({endLevel, score, time, minScore, levelId, timeInMs}) => {

  const [openModal, setOpenModal] = React.useState(endLevel);
  const navigate = useNavigate();
  const {session} = React.useContext(SessionContext);


  const postEndOfLevel = async () => {
    try{
      const APIResponse = await fetch(
        `${API_URL}/user_progress/end_of_level`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: session.user.id,
            levelId: levelId,
            score: score,
            time: timeInMs
          })
        }
      );
      const json = await APIResponse.json();
      if (APIResponse.status !== 200){
        const endMSG = json.detail[0].msg ? json.detail[0].msg : json.detail;
        let error_msg = APIResponse.status + " - " + APIResponse.statusText + " - " + endMSG;
        throw new Error(error_msg);
      }
    }catch(e){
      throw new Error(e);
    }
  }


  React.useEffect(() => {
    setOpenModal(endLevel);
    console.log(session);
    if(endLevel && session.user){
      postEndOfLevel();
    }
    // eslint-disable-next-line
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
                <p style={{color:"green"}}><strong>Tu puntaje final es</strong>: {score}</p>
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
