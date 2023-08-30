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
    <Dialog open={openDialog} onClose={handleClose} maxWidth='md' fullWidth={true}>
      <DialogContent style={{backgroundColor:'#68B9D2'}} sx={{minHeight:"75vh", display:"flex", alignContent:"center", justifyContent:"center", alignItems:"center"}}>
        {
          login ?
            <LoginForm setLogin={setLogin} setOpenDialog={setOpenDialog}/>
          :
            <SignUpForm setLogin={setLogin} setOpenDialog={setOpenDialog}/>
        }
      </DialogContent>
    </Dialog>
  )
}
