import React from 'react'
import { LoginDialog } from './LoginDialog';
import { SessionContext } from '../Sessions/SessionContext';
import { SessionHooks } from '../Sessions/SessionHooks';
import { Button } from '@mui/material';

export const LoginButton = () => {

  const [openDialog, setOpenDialog] = React.useState(false);
  const [username, setUsername] = React.useState(null);
  const { session } = React.useContext(SessionContext);
  const { closeSession } = SessionHooks();

  React.useEffect(() => {
    if ( session && session["user"]){
      setUsername(session["user"]["name_to_show"]);
    }else{
      setUsername(null);
    }
  }, [session]);

  return (
    <>
      {
        username
         ?
          <>
            <p>
              <strong>¡Bienvenido, {username}!</strong>          
            </p>
            <Button onClick={closeSession} color="error" variant="contained">
              Cerrar sesi&oacute;n...
            </Button>
          </>
        :
          <div>
            <p className={"p_button"} onClick={() => setOpenDialog(true)}>
              Inicia sesi&oacute;n y guarda tu progreso...
            </p>
          </div>
      }
      <LoginDialog openDialog={openDialog} setOpenDialog={setOpenDialog}/>
    </>
  )
}
