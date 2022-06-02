import React from 'react'
import { AppBar, Container, Toolbar, Typography, Select, MenuItem, makeStyles, createTheme, ThemeProvider } from "@material-ui/core"
import { useNavigate } from "react-router-dom";
import { CryptoState } from '../CryptoContext';
import AuthModal from './Authentication/AuthModal';



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

   const { currency, setCurrency } = CryptoState();

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
                  <Typography onClick={() => navigate('/')} className={classes.title} variant='h6'>Biostabilizer Data</Typography>
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

                  <AuthModal />
               </Toolbar>
            </Container>
         </AppBar>
      </ThemeProvider>
   )
}

export default Header