import React from "react";
import { API_URL } from "../Constants/Constants";
import {
  Alert,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  CircularProgress,
  DialogActions
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { VALID_REGEX_EMAIL } from "../Constants/Constants";
import { hash } from "../Resources/Hasher";

export const SignUpForm = ({ setLogin, setOpenDialog }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const [nameToShow, setNameToShow] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(undefined);
  const [signupFeedback, setSignupFeedback] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const validateFields = () => {
    const errorArray = [];
    if (
      email === "" ||
      password === "" ||
      passwordConfirmation === "" ||
      nameToShow === ""
    ) {
      errorArray.push("Aún existen campos sin completar.");
    }
    if (password !== passwordConfirmation) {
      errorArray.push("Las contraseñas establecidas no coinciden.");
    }
    if (password.length < 8) {
      errorArray.push(
        "La contraseña debe tener una longitud mínima de 8 caracteres."
      );
    }
    if (!email.match(VALID_REGEX_EMAIL)) {
      errorArray.push("El email establecido es inválido.");
    }
    if (errorArray.length > 0) {
      setError(errorArray);
      return false;
    } else {
      setError(undefined);
      return true;
    }
  };

  const postSignUp = async () => {
    setLoading(true);
    const fetchUrl = `${API_URL}/users/register`;
    try {
      const APIResponse = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: hash(password),
          name_to_show: nameToShow,
        }),
      });
      if (APIResponse.status !== 200) {
        const json = await APIResponse.json();
        setLoading(false);
        const endMSG = json.detail[0].msg ? json.detail[0].msg : json.detail;
        let error_msg =
          APIResponse.status + " - " + APIResponse.statusText + " - " + endMSG;
        throw new Error(error_msg);
      }
      setLoading(false);
      return APIResponse.json();
    } catch (e) {
      setLoading(false);
      throw new Error(e);
    }
  };

  const submitSignUp = async (event) => {
    event.preventDefault();
    if (!validateFields()) {
      return;
    }
    // eslint-disable-next-line
    const res = await postSignUp();
    setSignupFeedback("Su usuario ha sido creado exitosamente.");
  };


  const handleCloseDialog = () => {
    setSignupFeedback("");
    setOpenDialog(false);
  }

  return (
    <>
      <Dialog onClose={handleCloseDialog} open={signupFeedback !== ""}>
        <DialogTitle>
          Creación de usuario
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {signupFeedback}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <form onSubmit={submitSignUp}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "column",
            textAlign: "center",
            margin: "auto",
          }}
        >
          {error && (
            <Alert
              severity="error"
              style={{ textAlign: "justify" }}
              onClose={() => setError(undefined)}
            >
              Han ocurrido los siguientes errores:
              <ul>
                {error.map((listerror, idx) => (
                  <li key={idx}>{listerror}</li>
                ))}
              </ul>
            </Alert>
          )}
          <h1 sx={{ position: "absolute", top: 0 }}>Crea tu cuenta</h1>
          <div style={{ marginTop: 20 }}>
            <TextField
              style={{ width: "80%" }}
              type="text"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              name="email"
              label="E-Mail"
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <TextField
              style={{ width: "80%" }}
              type="text"
              onChange={(event) => setNameToShow(event.target.value)}
              value={nameToShow}
              name="username"
              label="Nombre para mostrar"
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <TextField
              style={{ width: "80%" }}
              type={showPassword ? "text" : "password"}
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              name="password"
              label="Contraseña"
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <TextField
              style={{ width: "80%" }}
              type={showPassword ? "text" : "password"}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              value={passwordConfirmation}
              name="passwordConfirmation"
              label="Repetir Contraseña"
            />
          </div>
          <div style={{ marginTop: 20 }}>
            {
              loading ? <CircularProgress/> :
              <Button variant="contained" type="submit">
                CREAR CUENTA
              </Button>
            }
          </div>
          <div style={{ marginTop: 20 }}>
            <p
              className={"p_button"}
              onClick={() => {
                setLogin(true);
              }}
            >
              ¿Ya poses una cuenta? Inicia sesión...
            </p>
          </div>
        </div>
      </form>
    </>
  );
};
