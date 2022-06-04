import { CircularProgress, createTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { HistoricalChart } from '../config/api';
import { RoleState } from '../PatientContext';
import axios from "axios";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
} from 'chart.js';
import { chartDays } from '../config/data';
import SelectButton from './SelectButton';
 
 
ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend
);

const useStyles = makeStyles((theme) => ({
   container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
         width: "100%",
         marginTop: 0,
         padding: 20,
         paddingTop: 0,
      },

   }
}));

const PatientInfo = ({ patient }) => {
   const [historicData, setHistoricData] = useState();
   const [days, setDays] = useState(1);

   const { currency } = RoleState();

   const fetchHistoricData = async () => {
      const { data } = await axios.get(HistoricalChart(patient.id, days, currency));

      setHistoricData(data.prices);
   };

   useEffect(() => {
      fetchHistoricData();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currency, days]);

   const darkTheme = createTheme({
      palette: {
         primary: {
            main: "#fff",
         },
         type: "dark"
      },
   });

   const classes = useStyles();

   return (
      <ThemeProvider theme={darkTheme}>
         <div className={classes.container}>
            {
               !historicData ? (
                  <CircularProgress
                     style={{ color: "rgb(0,113,115)" }}
                     size={250}
                     thickness={1}
                  />
               ) : (
                  <>
                     <Line
                        data={{
                           labels: 
                              historicData.map((patient) => {
                                 let date = new Date(patient[0]);
                                 let time = 
                                    date.getHours() > 12
                                       ? `${date.getHours() - 12}:${date.getMinutes()}PM`
                                       : `${date.getHours()}:${date.getMinutes()}AM`;
                                 return days===1 ? time : date.toLocaleDateString();
                              }),

                           datasets: [
                              {
                                 data: historicData.map((patient) => patient[1]),
                                 label: `Price ( Past ${days} Days) in ${currency}`,
                                 borderColor: "rgb(0,113,115)"
                              }
                           ]
                        }}
                        options={{
                           elements: {
                              point: {
                                 radius: 1,
                              },
                           },
                        }}
                     />
                     <div
                        style={{
                           display: "flex",
                           marginTop: 20,
                           justifyContent: "space-around",
                           width: "100%",
                        }}
                     >
                        {chartDays.map(day => (
                           <SelectButton
                              key={day.value}
                              onClick={()=>setDays(day.value)}
                              selected={day.value === days}>
                              {day.label}
                           </SelectButton>
                        ))}
                     </div>
                  </>
               )
            }
         </div>
      </ThemeProvider>
   )
}

export default PatientInfo