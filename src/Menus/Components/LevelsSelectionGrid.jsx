import React from 'react'
import { Card, CardActions, Grid } from '@mui/material';
import { LevelCard } from './CardLevel/LevelCardContent';
import Carousel from 'react-material-ui-carousel';
import { useNavigate } from "react-router-dom";

export const LevelsSelectionGrid = () => {

  const [levels, setLevels] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    if(localStorage.getItem("VR") !== null){
        localStorage.removeItem("VR");
        window.location.reload();
    }
  }, []);

  React.useEffect(() => {
    const levelsEffect = [];
    fetch("./levels/basics.json")
    .then((response) => response.json())
    .then((data) => {
      levelsEffect.push(data);
      fetch("./levels/reversa.json")
        .then((response) => response.json())
        .then((data) => {
            levelsEffect.push(data);
            fetch("./levels/adelanto.json")
            .then((response) => response.json())
            .then((data) => {
                levelsEffect.push(data);
                fetch("./levels/giro_en_u.json")
                .then((response) => response.json())
                .then((data) => {
                    levelsEffect.push(data);
                    fetch("./levels/estacionamiento.json")
                    .then((response) => response.json())
                    .then((data) => {
                        levelsEffect.push(data);
                        fetch("./levels/manejo_libre.json")
                        .then((response) => response.json())
                        .then((data) => {
                            levelsEffect.push(data);
                            setLevels(levelsEffect);
                        });
                    });
                });
            });
        });
    });
  }, []);


  const seleccionarNivel = (level) => {
    navigate("/scene", { state: { jsonLevel: level } });
  }

  return (
    <Grid container justifyContent={"center"} alignItems={"center"} alignContent={"center"}>
        <Grid item xs={12} md={9} lg={6} alignContent={"center"} justifyContent={"center"} alignItems={"center"}>
            <Carousel
                sx={{width:"100%", boxShadow:"2px 2px 10px gray", padding:"20px"}}
                autoPlay={false}
                navButtonsAlwaysVisible={true}
                navButtonsProps={{
                    style: {"opacity":"40%"}
                }}
                swipe={true}
                className={"levelsCarousel"}
            >
                {levels.map(level => 
                    <Card key={level.title} sx={{height:500, width:"90%", margin:"auto"}} onClick={() => {seleccionarNivel(level)}}>
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
