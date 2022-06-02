import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { CryptoState } from '../../PatientContext';
import { Avatar, Button } from '@material-ui/core';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

const useStyles = makeStyles({
  container: {
     width: 350,
     padding: 25,
     height: "100%",
     display: "flex",
     flexDirection: "column",
     fontFamily: "monospace",
  },
  profile: {
     flex: 1,
     display: "flex",
     flexDirection: "column",
     alignItems: "center",
     gap: "20px",
     height: "92%",
  },
  picture: {
     width: 100,
     height: 100,
     cursor: "pointer",
     backgroundColor: "rgb(0,113,115)",
     objectFit: "contain",
  },
  logout: {
     height: "8%",
     width: "100%",
     backgroundColor: "rgb(0,113,115)",
     marginTop: 20,
  },
  patientlist: {
     flex: 1,
     width: "100%",
     backgroundColor: "grey",
     borderRadius: 10,
     padding: 15,
     paddingTop: 10,
     display: "flex",
     flexDirection: "column",
     alignItems: "center",
     gap: 12,
     overflowY: "scroll",
  }
});

export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const { user, setAlert } = CryptoState();
  

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

   const logout = () => {
      signOut(auth);
      setAlert({
         open: true,
         type: "success",
         message: "You have logged out!",
      });

      toggleDrawer();
   };
  
  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar 
            onClick={toggleDrawer(anchor, true)}
            style={{
               height: 38,
               width: 38,
               marginLeft: 15,
               cursor: "pointer",
               backgroundColor: "rgb(0,113,115)"
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            <div className={classes.container}>
               <div className={classes.profile}>
                  <Avatar 
                     className={classes.picture}
                     src={user.photoURL}
                     alt={user.displayName || user.email}
                  />
                  <span
                     style={{
                        width: "100%",
                        fontSize: 25,
                        textAlign: "center",
                        fontWeight: "bolder",
                        wordWrap: "break-word",
                     }}>
                     {user.displayName || user.email }
                  </span>
                  <div className={classes.patientlist}>
                     <span style={{ fontSize: 15, textShadow: "0 0 5px black"}}>
                        Patient List
                     </span>
                  </div>
               </div>
               <Button
                  variant="contained"
                  className={classes.logout}
                  onClick={logout}>
                  Logout
               </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
