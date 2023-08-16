import React from 'react'
import { LoginDialog } from './LoginDialog';

export const LoginButton = () => {

  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <>
      <div>
        <p className={"p_button"} onClick={() => setOpenDialog(true)}>
          Inicia sesi&oacute;n y guarda tu progreso...
        </p>
      </div>
      <LoginDialog openDialog={openDialog} setOpenDialog={setOpenDialog}/>
    </>
  )
}
