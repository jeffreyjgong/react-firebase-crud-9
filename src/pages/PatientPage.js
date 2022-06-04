import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RoleState } from '../PatientContext'
import { SingleCoin } from '../config/api'
import { makeStyles, Typography, LinearProgress, Button } from '@material-ui/core'
import PatientInfo from '../components/PatientInfo';
import ReactHtmlParser from "react-html-parser"
import { numberWithCommas } from '../components/Banner/Carousel'
import Header from '../components/Header';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    borderRight: "2px solid grey",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Montserrat",
  },
  description: {
    width: "100%",
    fontFamily: "Montserrat",
    padding: 25,
    paddingBottom: 15,
    paddingTop: 0,
    textAlign: "justify",
  },
  marketData: {
    alignSelf: "start",
    padding: 25,
    paddingTop: 10,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
    },
  },
}));

const PatientPage = () => {
  const { id } = useParams();
  const [ coin, setCoin] = useState();

  const { currency, symbol, user, patientlist, setAlert } = RoleState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));

    setCoin(data);
  };

  console.log(coin);

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inPatientlist = patientlist.includes(coin?.id);

  const addToPatientList = async () => {
    const patientRef = doc(db, "patientlist", user.uid);

    try {
      await setDoc(patientRef, 
        {coins: patientlist ? [...patientlist, coin?.id] : [coin?.id]}
      );

      setAlert({
        open: true,
        message: `${coin.name} was added to patient list!`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  }

  const removeFromPatientlist = async () => {
    const patientRef = doc(db, "patientlist", user.uid);

    try {
      await setDoc(
        patientRef, 
        {
          coins: patientlist.filter((patient) => patient !== coin?.id)
        },
        { merge: "true" }
      );

      setAlert({
        open: true,
        message: `${coin.name} was removed from patient list!`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  }
  const classes = useStyles();

  if (!coin) return <LinearProgress style={{ backgroundColor: "rgb(0,113,115)"}}/>;

  return (
    <>
      <Header />
      <div className={classes.container}>
        <div className={classes.sidebar}>
          <img
            src={coin?.image.large}
            alt={coin?.name}
            height="200"
            style={{ marginBottom: 20 }}
          />
          <Typography
            variant="h3"
            className={classes.heading}>
            {coin?.name}
          </Typography>
          <Typography
            variant="subtitle1"
            className={classes.description}>
            {ReactHtmlParser(coin?.description.en.split(". ")[0])}
          </Typography>
          <div className={classes.marketData}>
            <span style= {{ display: "flex"}}>
              <Typography variant="h5" className={classes.heading}>
                Rank:
              </Typography>
              &nbsp; &nbsp;
              <Typography
                variant="h5"
                style={{
                  fontFamily: "Montserrat",
                }}>
                  {coin?.market_cap_rank}
              </Typography>
            </span>
            <span style= {{ display: "flex"}}>
              <Typography variant="h5" className={classes.heading}>
                Current Price:
              </Typography>
              &nbsp; &nbsp;
              <Typography
                variant="h5"
                style={{
                  fontFamily: "Montserrat",
                }}>
                  {symbol}{numberWithCommas(
                    coin?.market_data.current_price[currency.toLowerCase()]
                  )}
              </Typography>
            </span>
            <span style= {{ display: "flex"}}>
              <Typography variant="h5" className={classes.heading}>
                Market Cap:
              </Typography>
              &nbsp; &nbsp;
              <Typography
                variant="h5"
                style={{
                  fontFamily: "Montserrat",
                }}>
                  {symbol}{numberWithCommas(coin?.market_data.market_cap[currency.toLowerCase()]
                    .toString()
                    .slice(0,-6))}M
              </Typography>
            </span>

            {user && (
              <Button
                variant="outlined"
                style={{
                  width: "100%",
                  height: 40,
                  backgroundColor: inPatientlist ? "rgb(255,99,71)" : "rgb(0,113,115)"
                }}
                onClick = {inPatientlist ? removeFromPatientlist : addToPatientList}>
                {!inPatientlist ? "Add to Patient List" : "Remove from Patient List"}
              </Button>
            )}
          </div>
        </div>

        <PatientInfo patient={coin}/>
      </div>
    </>
  )
}

export default PatientPage