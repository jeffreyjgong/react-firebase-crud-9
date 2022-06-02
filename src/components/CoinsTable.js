import { Container, createTheme, LinearProgress, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CoinList } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { numberWithCommas } from './Banner/Carousel';

const useStyles = makeStyles({
   row: {
      backgroundColor: "#16171a",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#131111",
      },
      fontFamily: "Montserrat",
    },
    pagination: {
      "& .MuiPaginationItem-root": {
        color: "gold",
      },
    },
})

const CoinsTable = () => {
   const [coins, setCoins] = useState([]);
   const [loading, setLoading] = useState(false);

   // eslint-disable-next-line
   const [search, setSearch ] = useState("");

   const [page, setPage ] = useState(1);

   const navigate = useNavigate();

   const classes = useStyles();

   const { currency, symbol } = CryptoState();
   const fetchCoins = async () => {
      setLoading(true);
      const { data } = await axios.get(CoinList(currency));
      
      setCoins(data);
      setLoading(false);
   }

   console.log(coins);

   useEffect(() => {
      fetchCoins()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currency]);

   const darkTheme = createTheme({
      palette: {
         primary: {
            main: "#fff",
         },
         type: "dark",
      }
   });

   const handleSearch = () => {
      return coins.filter((coin) => 
         coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search)
      )
   }

   return (
      <ThemeProvider theme={darkTheme}>
         <Container style={{ textAlign: "center"}}>
            <Typography
               variant="h4"
               style = {{ margin: 18, fontFamily: "Montserrat" }}
            >
               Patient Info
            </Typography>

            <TextField
               label="Search For a Patient..."
               variant="outlined"
               style = {{ marginBottom: 20, width: "100%" }}
               onChange={(e) => setSearch(e.target.value)}
            />

            <TableContainer>
               {
                  loading ? (
                     <LinearProgress style = {{ background: "gold" }}/>
                  ) : (
                     <Table>
                        <TableHead style = {{ backgroundColor: "rgb(0,113,115)" }}>
                           <TableRow>
                              {["Name", "PT", "Last Monitored", "Location"].map((head) => (
                                 <TableCell
                                    style={{
                                       color: "black",
                                       fontWeight: "700",
                                       fontFamily: "Montserrat",
                                    }}
                                    key={head}
                                    align={head === "Name" ? "" : "right"}>
                                    {head}
                                 </TableCell>
                              ))}
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {handleSearch()
                              .slice((page-1) * 10, (page - 1) * 10 + 10)
                              .map(row => {
                              const profit = row.price_change_percentage_24h > 0;

                              return (
                                 <TableRow
                                    onClick={() => navigate(`/coins/${row.id}`)}
                                    className={classes.row}
                                    key={row.name}
                                 >
                                    <TableCell 
                                       component="th" 
                                       scope="row"
                                       style={{
                                          display: "flex",
                                          gap: 15,
                                       }}>
                                       <img
                                          src={row?.image}
                                          alt={row.name}
                                          height="50"
                                          style={{ marginBottom: 10 }}
                                       />
                                       <div
                                          style={{ display: "flex", flexDirection: "column"}}>
                                          <span
                                             style={{ 
                                                textTransform: "uppercase",
                                                fontSize: 22,
                                             }}>
                                             {row.symbol}
                                          </span>
                                          <span style = {{ color: "darkgrey" }}>
                                             {row.name}
                                          </span>

                                       </div>
                                    </TableCell>
                                    <TableCell 
                                       align="right"
                                       style={{
                                          fontSize: 15
                                       }}
                                    >
                                       {symbol}{numberWithCommas(row.current_price.toFixed(2))}
                                    </TableCell>
                                    <TableCell
                                       align="right"
                                       style={{
                                          color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                                          fontWeight: 500,
                                          fontSize: 15,
                                       }}>
                                       {profit && "+"}{row.price_change_percentage_24h.toFixed(2)}%
                                    </TableCell>
                                    <TableCell 
                                       align="right"
                                       style={{
                                          fontSize: 15,
                                       }}
                                    >
                                       {symbol}{numberWithCommas(row.market_cap.toString().slice(0, -6))}M
                                    </TableCell>
                                 </TableRow>
                              )
                           })}
                        </TableBody>
                     </Table>
                  )
               }
            </TableContainer>
            <Pagination
               style={{
                  padding: 20,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
               }}
               count={(handleSearch()?.length/10).toFixed(0)} 
               onChange={(_, value) => {
                  setPage(value);
                  window.scroll(0, 450);
               }}
               />
         </Container>
      </ThemeProvider>
   )
}

export default CoinsTable