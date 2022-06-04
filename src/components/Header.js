import React from 'react'
import { AppBar, Container, Toolbar, Typography, Select, MenuItem, makeStyles, createTheme, ThemeProvider } from "@material-ui/core"
import { useNavigate } from "react-router-dom";
import { RoleState } from '../PatientContext';
import AuthModal from './Authentication/AuthModal';
import UserSidebar from './Authentication/UserSidebar';



const useStyles = makeStyles(() => ({
   title: {
      flex: 1,
      color: "rgb(0,113,115)",
      fontFamily: "Montserrat",
      fontWeight: "bold",
      cursor: "pointer",
   }
}));

const Header = () => {

   const classes = useStyles();

   const navigate = useNavigate();

   const { currency, setCurrency, user } = RoleState();

   const darkTheme = createTheme({
      palette: {
         primary: {
            main: "#fff",
         },
         type: "dark",
      }
   });

   return (
      <ThemeProvider theme={darkTheme}>
         <AppBar color='transparent' position='static'>
            <Container>
               <Toolbar>
                  <Typography onClick={() => navigate('/home')} className={classes.title} variant='h6'>Esurgi Web Portal</Typography>
                  <Select variant="outlined" style={{
                  width: 100,
                  height: 40,
                  marginRight: 15,
                  }}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  >
                     <MenuItem value={"USD"}>Therapist</MenuItem>
                     <MenuItem value={"CNY"}>Patient</MenuItem>
                  </Select>

                  {user ? <UserSidebar /> : <AuthModal />}
               </Toolbar>
            </Container>
         </AppBar>
      </ThemeProvider>
   )
}

export default Header