import React from 'react'
import {API_URL} from '../Constants/Constants';
import { Alert, Button, TextField, InputAdornment, IconButton } from "@mui/material"
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { VALID_REGEX_EMAIL } from '../Constants/Constants';
import { hash } from '../Resources/Hasher';


export const SignUpForm = ( {setLogin} ) => {

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const [nameToShow, setNameToShow] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const validateFields = () => {
    const errorArray = [];
    if (email === "" || password === "" || passwordConfirmation === "" || nameToShow === ""){
      errorArray.push("Aún existen campos sin completar.")
    }
    if (password !== passwordConfirmation){
      errorArray.push("Las contraseñas establecidas no coinciden.");
    }
    if (password.length < 8){
      errorArray.push("La contraseña debe tener una longitud mínima de 8 caracteres.");
    }
    if (!email.match(VALID_REGEX_EMAIL)){
      errorArray.push("El email establecido es inválido.");
    }
    if(errorArray.length > 0){
      setError(errorArray);
      return false;
    }else{
      setError(undefined);
      return true;
    }
  }


  const postSignUp = async () => {
    const fetchUrl = `${API_URL}/users/register`;
    try{
      const APIResponse = await fetch(
        fetchUrl,
        {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              "email": email,
              "password": hash(password),
              "name_to_show": nameToShow
          })
        }
      );
      if (APIResponse.status !== 200){
        const json = await APIResponse.json();
        const endMSG = json.detail[0].msg ? json.detail[0].msg : json.detail;
        let error_msg = APIResponse.status + " - " + APIResponse.statusText + " - " + endMSG;
        throw new Error(error_msg);
      }
      return APIResponse.json();
  }catch(e){
      throw new Error(e);
  }
  }


  const submitSignUp = async (event) => {
    event.preventDefault();
    if (!validateFields()){
      return;
    }
    // eslint-disable-next-line
    const res = await postSignUp();
    /*TODO: Mostrar dialog de creado exitoso, y despues mandarlo al login...*/
  }


  return (
    <form onSubmit={submitSignUp}>
        <div style={{
            display:"flex", 
            justifyContent:"center", 
            alignContent:"center", 
            flexDirection:"column", 
            textAlign:"center",
            margin: "auto",
            padding:30,
            border: "2px solid black",
            borderRadius: 20,
            maxWidth:400
        }}>
            {error && 
                <Alert severity="error" style={{textAlign:"justify"}} onClose={() => setError(undefined)}>
                    Han ocurrido los siguientes errores:
                    <ul>
                        {error.map((listerror, idx) => <li key={idx}>{listerror}</li>)}
                    </ul>
                </Alert>
            }
            <h1>Crea tu cuenta</h1>
            <div style={{marginTop:20}}>
                <TextField 
                  style={{width:"80%"}}
                  type="text" 
                  onChange={(event) => setEmail(event.target.value)} 
                  value={email} 
                  name="email"
                  label="E-Mail"
                />
            </div>
            <div style={{marginTop:20}}>
                <TextField 
                  style={{width:"80%"}}
                  type="text" 
                  onChange={(event) => setNameToShow(event.target.value)} 
                  value={nameToShow} 
                  name="username"
                  label="Nombre para mostrar"
                />
            </div>
            <div style={{marginTop:20}}>
                <TextField 
                  style={{width:"80%"}}
                  type={showPassword ? "text" : "password"}
                  onChange={(event) => setPassword(event.target.value)} 
                  value={password} 
                  name="password"
                  label="Contraseña"
                  InputProps={{ // <-- This is where the toggle button is added.
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
            </div>
            <div style={{marginTop:20}}>
                <TextField 
                    style={{width:"80%"}}
                    type={showPassword ? "text" : "password"}
                    onChange={(event) => setPasswordConfirmation(event.target.value)} 
                    value={passwordConfirmation} 
                    name="passwordConfirmation"
                    label="Repetir Contraseña"
                />
            </div>
            <div style={{marginTop:20}}>
                {/*TODO: CONSIDERAR EL SPINNER CUANDO ESTA CARGANDO*/}
                <Button variant="contained" type="submit">CREAR CUENTA</Button>
            </div>
            <div style={{marginTop:20}}>
                <p className={"p_button"} onClick={() => {setLogin(true)}}>¿Ya poses una cuenta? Inicia sesión...</p>
            </div>
        </div>
    </form>
  )
}
