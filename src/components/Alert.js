import { Snackbar } from '@material-ui/core';
import React from 'react'
import { RoleState } from '../PatientContext'
import MuiAlert from '@material-ui/lab/Alert'

const Alert = () => {
   const {alert, setAlert} = RoleState();

   const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
         return;
      }

      setAlert({open: false});
   };

   return (
   <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={handleClose}
      >
      <MuiAlert
         onClose={handleClose}
         elevation={10}
         variant="filled"
         severity={alert.type}
      >
         {alert.message}
      </MuiAlert>
      </Snackbar>
   );
}

export default Alert