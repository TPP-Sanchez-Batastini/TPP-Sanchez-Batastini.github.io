import React from 'react'
import { LoginDialog } from './LoginDialog';
import { SessionContext } from '../Sessions/SessionContext';

export const LoginButton = () => {

  const [openDialog, setOpenDialog] = React.useState(false);
  const [username, setUsername] = React.useState(null);
  const { session } = React.useContext(SessionContext);

  React.useEffect(() => {
    if ( session && session["user"])
      setUsername(session["user"]["name_to_show"]);
  }, [session]);

  return (
    <>
      {
        username
         ?
          <p>
            <strong>¡Bienvenido, {username}!</strong>
          </p>
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
