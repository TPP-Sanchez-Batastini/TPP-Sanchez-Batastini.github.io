import React from 'react'
import {LoginForm} from "./LoginForm";
import {SignUpForm} from "./SignUpForm";
import { Dialog, DialogContent} from "@mui/material";

export const LoginDialog = ( {openDialog, setOpenDialog} ) => {

  const [login, setLogin] = React.useState(true);

  const handleClose = () => {
    setOpenDialog(false);
  }

  return (
    <Dialog open={openDialog} onClose={handleClose} >
      <DialogContent style={{backgroundColor:'#68B9D2'}}>
        {
          login ?
            <LoginForm setLogin={setLogin}/>
          :
            <SignUpForm setLogin={setLogin}/>
        }
      </DialogContent>
    </Dialog>
  )
}
