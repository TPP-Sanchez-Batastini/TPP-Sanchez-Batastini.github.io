import React from 'react'
import {API_URL} from '../Constants/Constants'
import { SessionHooks } from '../Sessions/SessionHooks';
import { Button, TextField } from "@mui/material"
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export const LoginForm = () => {

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { setSessionWithResponse } = SessionHooks();

  const postLogin = async () => {
    const APIResponse = await fetch(
        `${API_URL}/users/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        }
    );
    if (APIResponse.status !== 200){
        const json = await APIResponse.json();
        throw new Error(json.detail);
    }
    return APIResponse.json();
  }


  const submitLogin = async (event) => {
    event.preventDefault();
    try{
        const loginResponse = await postLogin();
        setSessionWithResponse(loginResponse);
    }catch(e){
        console.log(e);
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
        throw new Error(json.detail);
    }
    return APIResponse.json();
  }

  const submitGoogleLogin = async (token) => {
    try{
        const responseAPI = await postLoginGoogle(token);
        console.log(responseAPI);
        setSessionWithResponse(responseAPI);
    }catch(e){
        console.log(e);
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
            marginTop:40,
            padding: 30,
            border: "2px solid black",
            borderRadius: 20,
            maxWidth:400
        }}>
            <h1>Iniciar Sesión</h1>
            <div style={{display:"flex", justifyContent:"center"}}>
                <img src="logo_transp.png" width="25%" alt="Driving Simulator Logo"/>
            </div>
            <div style={{marginTop:20}}>
                <TextField 
                    type="text" 
                    onChange={(event) => setEmail(event.target.value)} 
                    value={email} 
                    name="email"
                    label="E-Mail"
                />
            </div>
            <div style={{marginTop:20}}>
                <TextField 
                    type="password" 
                    onChange={(event) => setPassword(event.target.value)} 
                    value={password} 
                    name="password"
                    label="Contraseña"
                />
            </div>
            <div style={{marginTop:20}}>
                <Button variant="contained" onClick={submitLogin}>Iniciar Sesión</Button>
            </div>
            <div style={{marginTop:20}}>
                <Link to={"/signup"}>¿No posees una cuenta? Registrate aquí...</Link>
            </div>
            <div style={{marginTop:20, display:"flex", justifyContent:"center", textAlign:"center", alignContent:"center"}}>
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        const OAuthToken = credentialResponse.credential;
                        submitGoogleLogin(OAuthToken);
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
            </div>
        </div>
    </form>
  )
}

