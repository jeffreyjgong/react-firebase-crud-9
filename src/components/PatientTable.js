import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import {
  Container,
  createTheme,
  TableCell,
  LinearProgress,
  ThemeProvider,
  Typography,
  TextField,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { RoleState } from "../PatientContext";
import { BsFillXCircleFill, BsFillPlusCircleFill } from "react-icons/bs";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function PatientsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { symbol, coins, loading, patientlist, user, setAlert } = RoleState();

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
        color: "rgb(0,113,115)",
      },
    },
  });

  const classes = useStyles();
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  const inPatientlist = (coin) => {
    return patientlist.includes(coin?.id);
  }
  const addToPatientList = async (coin) => {
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

  const removeFromPatientlist = async (coin) => {
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
  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          List of Patients
        </Typography>
        <TextField
          label="Search For a Patient..."
          variant="outlined"
          style={{ marginBottom: 20, width: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ backgroundColor: "rgb(0,113,115)" }}>
                <TableRow>
                  {["Name", "PT", "Last Monitored", "Location", "Add"].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key={head}
                      align={head === "Name" ? "left" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                          onClick={() => navigate(`/patients/${row.id}`)}
                        >
                          <img
                            src={row?.image}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {row.name}
                            </span>
                          </div>
                          
                        </TableCell>
                        
                        <TableCell align="right" onClick={() => navigate(`/patients/${row.id}`)}>
                          {symbol}{" "}
                          {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                          onClick={() => navigate(`/patients/${row.id}`)}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right" onClick={() => navigate(`/patients/${row.id}`)}>
                          {symbol}{" "}
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                          M
                        </TableCell>
                        <TableCell align="right">
                          {
                            !inPatientlist(row) ? 
                              <BsFillPlusCircleFill
                                style={{
                                  fontSize: 25,
                                  color: "green",
                                }}
                                onClick={() => addToPatientList(row)}>
                              </BsFillPlusCircleFill>
                              :
                              <BsFillXCircleFill
                                style={{
                                  fontSize: 25,
                                  color: "red",
                                }}
                                onClick={() => removeFromPatientlist(row)}>                               
                              </BsFillXCircleFill>
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Comes from @material-ui/lab */}
        <Pagination
          count={parseInt((handleSearch()?.length / 10).toFixed(0))}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
}