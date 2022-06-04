import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage';
import PatientPage from './pages/PatientPage';
import LandingPage from './pages/LandingPage.js';
import { makeStyles } from "@material-ui/core/styles";
import Alert from './components/Alert';

const useStyles = makeStyles({
  App: {
    backgroundColor: '#14161a',
    color: "white",
    minHeight: "100vh",
  },
});

function App() {
  

  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={ classes.App}>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/home' element={<Homepage />} />
          <Route path='/patients/:id' element={<PatientPage />} />
        </Routes>
      </div>
      <Alert />
    </BrowserRouter>
  );
}

export default App;
