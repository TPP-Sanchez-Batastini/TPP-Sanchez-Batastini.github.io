import Slider from "@mui/material/Slider";
import {
  Box,
  Button,
  Grid,
  Typography,
  Switch,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import React from "react";

const calidadEspejos = [
  {
    value: 0,
    label: "Desactivado",
    createMirrors: false,
    true_value_aa: 0,
    true_value_res: 0
  },
  {
    value: 1,
    label: "Baja",
    createMirrors: true,
    true_value_res: 0.3,
    true_value_aa: 0
  },
  {
    value: 2,
    label: "Media",
    createMirrors: true,
    true_value_res: 0.6,
    true_value_aa: 2
  },
  {
    value: 3,
    label: "Alta",
    createMirrors: true,
    true_value_res: 1,
    true_value_aa: 4
  },
];
const resolucion = [
  {
    value: 1,
    label: "Baja",
    true_value: 0.25
  },
  {
    value: 2,
    label: "Media",
    true_value: 0.5
  },
  {
    value: 3,
    label: "Alta",
    true_value: 1
  },
];

const resolucionVR = [
  {
    value: 0,
    label: "X0.25",
    true_value: 0.25
  },
  {
    value: 1,
    label: "X0.50",
    true_value: 0.50
  },
  {
    value: 2,
    label: "X0.75",
    true_value: 0.75
  },
  {
    value: 3,
    label: "X1",
    true_value: 1
  },
];


export const ConfigGrafics = ({ pausedLevel, pause }) => {


  const [indexEspejos, setIndexEspejos] = React.useState(3);
  const [indexRes, setIndexRes] = React.useState(3);
  const [indexVR, setIndexVR] = React.useState(2);
  const [viewDist, setViewDist] = React.useState(100);
  const [lightsOn, setLightsOn] = React.useState(true);
  const [typeController, setTypeController] = React.useState("G29");

  React.useEffect(() => {
    const currentConfig = JSON.parse(localStorage.getItem("graphic_config"));
    const currentController = localStorage.getItem("controller");
    setIndexEspejos(currentConfig.indexEspejos);
    setIndexVR(currentConfig.indexVR);
    setIndexRes(currentConfig.indexRes);
    setViewDist(currentConfig.ViewDistance);
    setLightsOn(currentConfig.lightsOn);
    setTypeController(currentController);
  }, []);

  function submitConfig() {
    const espejosElem = calidadEspejos.filter(elem => elem.value === indexEspejos)[0];
    const newConfig = {
        "VRResMultiplier": resolucionVR.filter(elem => elem.value === indexVR)[0].true_value,
        "ResMultiplier": resolucion.filter(elem => elem.value === indexRes)[0].true_value,
        "AAEspejos": espejosElem.true_value_aa,
        "MirrorResMultiplier": espejosElem.true_value_res,
        "CreateMirrors": espejosElem.createMirrors,
        "ViewDistance": viewDist,
        "lightsOn": lightsOn,
        "indexEspejos": indexEspejos,
        "indexRes": indexRes,
        "indexVR": indexVR,
    };
    localStorage.setItem("graphic_config", JSON.stringify(newConfig));
    localStorage.setItem("controller", typeController);
    window.location.reload();
  }

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid xs={8}>
        <InputLabel id="controller-label">Tipo de control</InputLabel>
        <Select
            labelId="controller-label"
            id="controller-select"
            value={typeController}
            label="Tipo de control"
            onChange={(e) => {console.log(e);setTypeController(e.target.value);}}
            style={{width:"100%", boxSizing:"border-box"}}
        >
            <MenuItem value={"XInput"}>Control de Xbox</MenuItem>
            <MenuItem value={"G29"}>Volante con palanca</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={8}>
        <Typography id="input-slider" gutterBottom>
          Calidad Espejos
        </Typography>
        <Slider defaultValue={3} marks={calidadEspejos} max={3} onChange={(e) => {setIndexEspejos(e.target.value)}} value={indexEspejos} />
      </Grid>
      <Grid item xs={8}>
        <Typography id="input-slider" gutterBottom>
          Resolución
        </Typography>
        <Slider defaultValue={3} marks={resolucion} max={3} min={1} onChange={(e) => {setIndexRes(e.target.value)}} value={indexRes} />
      </Grid>
      <Grid item xs={8}>
        <Typography id="input-slider" gutterBottom>
          Resolución Vr
        </Typography>
        <Slider defaultValue={2} marks={resolucionVR} max={3} onChange={(e) => {setIndexVR(e.target.value)}} value={indexVR}/>
      </Grid>
      <Grid item xs={8}>
        <Typography id="input-slider" gutterBottom>
          Distancia de visión (metros)
        </Typography>
        <Slider valueLabelDisplay="auto" defaultValue={100} max={300} value={viewDist} onChange={(e) => {setViewDist(e.target.value)}} />
      </Grid>
      <Grid item xs={8}>
        <FormControlLabel
          control={<Switch label="" onChange={(e) => {setLightsOn(e.target.checked)}} value={lightsOn} />}
          label="Activar luces vehiculos"
        />
      </Grid>
      <Grid item xs={8} md={4} style={{ textAlign: "center" }}>
        <Box style={{ textAlign: "center", margin: "auto" }}>
          <Button onClick={submitConfig} variant="contained" color="success">
            Aplicar Cambios y Reiniciar
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};
