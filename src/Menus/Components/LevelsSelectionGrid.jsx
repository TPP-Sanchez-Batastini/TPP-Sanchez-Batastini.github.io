import React from 'react'
import { Card, CardActions, Grid } from '@mui/material';
import { CardContentHover } from './CardLevel/CardContentHover';
import { CardContentNotHover } from './CardLevel/CardContentNotHover';

export const LevelsSelectionGrid = () => {

  const [levels, setLevels] = React.useState([]);
  const [cardHovers, setCardHovers] = React.useState([]);

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
                            const hovers = {};
                            for (let i=0; i<levelsEffect.length; i++){
                                hovers[levelsEffect[i].title] = false;
                            }
                            setLevels(levelsEffect);
                            setCardHovers(hovers);
                        });
                    });
                });
            });
        });
    });
    
    
    
    
  }, []);

  return (
    <Grid container spacing={4} rowSpacing={4} alignContent="center" justifyContent="space-around" sx={{padding:"2rem"}}>
        {levels.map(level => 
            <Grid item xs={12} md={6} lg={4} key={level.title}>
                <Card sx={{height:400}}>
                    <CardActions  
                        onMouseOver={ () => setCardHovers({...cardHovers, [level.title]:true}) }
                        onMouseOut={ () => setCardHovers({...cardHovers, [level.title]:false}) }
                    >
                        {cardHovers[level.title] ?
                            <CardContentHover level={level}/>
                        :
                            <CardContentNotHover level={level}/>
                        }
                    </CardActions>
                </Card>
            </Grid>
        )}
    </Grid>
  );
}
