import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { makeStyles } from "@material-ui/core"
import { TrendingCoins } from '../../config/api';
import { CryptoState } from "../../CryptoContext"

const useStyles = makeStyles((theme) => ({
   carousel: {
      height: "50%",
      display: "flex",
      alignItems: "center",
   },
}));



const Carousel = () => {
   // eslint-disable-next-line
   const [trending, setTrending] = useState([]);
   const classes = useStyles();

   const { currency } = CryptoState();
   
   const FetchTrendingCoins = async () => {
      const { data } = await axios.get(TrendingCoins(currency))

      setTrending(data);
      console.log(data);
      
   }

   useEffect(() => {
      FetchTrendingCoins();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currency]);

   return (
      <div className={classes.carousel}>Carousel</div>
   )
}

export default Carousel