import React from 'react'
import { Card, CardActions, Grid } from '@mui/material';
import { LevelCard } from './CardLevel/LevelCardContent';
import Carousel from 'react-material-ui-carousel';
import {API_URL} from '../Constants/Constants'

export const LevelsSelectionGrid = () => {

  const [levels, setLevels] = React.useState([]);
  

  React.useEffect(() => {
    if(localStorage.getItem("VR") !== null){
        localStorage.removeItem("VR");
        window.location.reload();
    }
  }, []);


  const fetchLevels = async () => {
    try{
      const levelsJSONs = [];
      const APIResponse = await fetch(
        `${API_URL}/levels/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        }
      );
      const json = await APIResponse.json();
      json.forEach(level => {
        level.level_json = JSON.parse(level.level_json);
        level.level_json.id = level.id;
        levelsJSONs.push(level.level_json);
      });
      if (APIResponse.status !== 200){
        const endMSG = json.detail[0].msg ? json.detail[0].msg : json.detail;
        let error_msg = APIResponse.status + " - " + APIResponse.statusText + " - " + endMSG;
        throw new Error(error_msg);
      }
      setLevels(levelsJSONs);
    }catch(e){
      throw new Error(e);
    }
  }

  React.useEffect(() => {
    fetchLevels();
  }, []);


  

  return (
    <Grid container justifyContent={"center"} alignItems={"center"} alignContent={"center"}>
        <Grid item xs={12} md={9} lg={6} alignContent={"center"} justifyContent={"center"} alignItems={"center"}>
            <Carousel
                sx={{width:"100%", padding:"20px"}}
                autoPlay={false}
                navButtonsAlwaysVisible={true}
                indicators={false}
                navButtonsProps={{
                    style: {"opacity":"0.4"}
                }}
                swipe={true}
                className={"levelsCarousel"}
                animation={'slide'}
            >
                {levels.map(level => 
                    <Card key={level.title} sx={{height:500, width:"90%", margin:"auto", background:"transparent", boxShadow: 0}}>
                        <CardActions>
                            <LevelCard level={level}/>
                        </CardActions>
                    </Card>
                )}
            </Carousel>
        </Grid>
    </Grid>
  );
}
