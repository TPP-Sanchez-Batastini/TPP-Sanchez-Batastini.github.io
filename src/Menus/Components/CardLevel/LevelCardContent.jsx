import { CardContent, CardHeader, CardMedia, Grid, Typography, Button, Box } from '@mui/material'
import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import { useNavigate } from "react-router-dom";
import CarRentalIcon from '@mui/icons-material/CarRental';
import { SessionContext } from '../../Sessions/SessionContext';
import { API_URL } from '../../Constants/Constants';
import "../../styles.css";

export const LevelCard = ({level}) => {

  const navigate = useNavigate();


  const {session} = React.useContext(SessionContext);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [completedData, setCompletedData] = React.useState({
    score: undefined,
    time: undefined
  });

  const seleccionarNivel = () => {
    navigate("/scene", { state: { jsonLevel: level } });
  }


  const getTimeInMSAsString = (timeInMs) => {
    const timeInSeconds = parseInt(timeInMs/1000);
    const seconds = timeInSeconds%60;
    const minutes = parseInt((timeInSeconds-seconds)/60);
    const minutesUpToSixty = minutes%60;
    const hours = parseInt((minutes-minutesUpToSixty)/24);
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}


  const fetchUserProgress = async () => {
    try{
      const APIResponse = await fetch(
        `${API_URL}/user_progress/?level_id=${level.id}&user_id=${session.user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const json = await APIResponse.json();
      if (APIResponse.status !== 200){
        const endMSG = json.detail[0].msg ? json.detail[0].msg : json.detail;
        let error_msg = APIResponse.status + " - " + APIResponse.statusText + " - " + endMSG;
        throw new Error(error_msg);
      }
      setIsCompleted(json.completed);
      setCompletedData({
        score: json.best_score,
        time: json.best_time ? getTimeInMSAsString(json.best_time) : json.best_time
      })
    }catch(e){
      throw new Error(e);
    }
  }


  React.useEffect(() => {
    if (session && session.user){
      fetchUserProgress();
    }
    // eslint-disable-next-line
  }, []);

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
            {isCompleted ?
              <Typography style={{color:"green", fontWeight:"bold"}}>
                <CheckCircleIcon style={{color:"green", verticalAlign:"middle", marginRight:10}}/>
                COMPLETADO
              </Typography>
            :
              <Typography style={{color:"red", fontWeight:"bold"}}>
                <CancelIcon style={{color:'red', verticalAlign:"middle", marginRight:10}}/>
                PENDIENTE
              </Typography>
            }
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {isCompleted && <>
            <Typography>
              <AccessTimeFilledIcon style={{verticalAlign:"middle", marginRight:10}}/>
              <strong>Mejor tiempo:</strong> 
            </Typography>
            <Typography style={{marginLeft:35}}>
              {completedData.time}
            </Typography>
          </>}
        </Grid>
        <Grid item xs={12} md={4}>
          {isCompleted && <>
            <Typography>
              <SportsScoreIcon style={{verticalAlign:"middle", marginRight:10}}/>
              <strong>Mejor puntaje:</strong>
            </Typography>
            <Typography style={{marginLeft:35}}>
              {completedData.score}
            </Typography>
          </>}
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
