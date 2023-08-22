import React from 'react'
import {API_URL} from '../Constants/Constants'
import { SessionHooks } from '../Sessions/SessionHooks';
import { Alert, Button, TextField, InputAdornment, IconButton } from "@mui/material"
import { GoogleLogin } from '@react-oauth/google';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { VALID_REGEX_EMAIL } from '../Constants/Constants';
import { hash } from '../Resources/Hasher';

export const LoginForm = ( {setLogin} ) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const { setSessionWithResponse } = SessionHooks();

  const postLogin = async () => {
    try{
        const APIResponse = await fetch(
            `${API_URL}/users/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "email": email,
                    "password": hash(password)
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


  const validateFields = () => {
    const errors = []
    if (password === ""){
        errors.push("El campo contraseña se encuentra vacío.");
    }
    if (email === ""){
        errors.push("El campo email se encuentra vacío");
    }
    if (!email.match(VALID_REGEX_EMAIL)){
        errors.push("El email establecido es inválido.");
      }
    if(errors.length > 0){
        setError(errors);
        return false;
    }else{
        return true;
    }
  }


  const submitLogin = async (event) => {
    event.preventDefault();
    if(!validateFields()){
        return;
    }
    try{
        const loginResponse = await postLogin();
        setSessionWithResponse(loginResponse);
        /*TODO: DAR UN FEEDBACK DE SESION INICIADA CORRECTAMENTE ANTES DE REDIR*/
    }catch(e){
        setError([e.toString().replaceAll("Error: ", "")]);
    }
  }


  const postLoginGoogle = async (token) => {
    const APIResponse = await fetch(
        `${API_URL}/users/login_google`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "token": token
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
  }

  const submitGoogleLogin = async (token) => {
    try{
        const responseAPI = await postLoginGoogle(token);
        setSessionWithResponse(responseAPI);
    }catch(e){
        setError([e.toString().replaceAll("Error: ", "")]);
    }
  }

  return (
    <form onSubmit={submitLogin}>
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
            <h1>Iniciar Sesión</h1>
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
                {/*TODO: CONSIDERAR EL SPINNER CUANDO ESTA CARGANDO*/}
                <Button variant="contained" type="submit">Iniciar Sesión</Button>
            </div>
            <div style={{marginTop:20}}>
                <p className={"p_button"} onClick={() => {setLogin(false);}}>¿No posees una cuenta? Registrate aqu&iacute;...</p>
            </div>
            <div style={{marginTop:20, display:"flex", justifyContent:"center", textAlign:"center", alignContent:"center"}}>
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        const OAuthToken = credentialResponse.credential;
                        submitGoogleLogin(OAuthToken);
                    }}
                    onError={() => {
                        setError(['El inicio de sesión con Google ha fallado.']);
                    }}
                />
            </div>
        </div>
    </form>
  )
}

