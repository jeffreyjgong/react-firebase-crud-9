import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { makeStyles } from "@material-ui/core"
import { TrendingCoins } from '../../config/api';
import { CryptoState } from "../../CryptoContext"
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
   carousel: {
      height: "50%",
      display: "flex",
      alignItems: "center",
   },
   carouselItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      textTransform: "uppercase",
      color: "white",
    },
}));

export function numberWithCommas(x) {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {
   // eslint-disable-next-line
   const [trending, setTrending] = useState([]);
   const classes = useStyles();

   const { currency, symbol } = CryptoState();
   
   const FetchTrendingCoins = async () => {
      const { data } = await axios.get(TrendingCoins(currency))

      setTrending(data);
      console.log(data);
      
   }

   useEffect(() => {
      FetchTrendingCoins();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currency]);

   const items = trending.map((coin) => {
      let profit = coin.price_change_percentage_24h >= 0;
      return (
         <div>
            <Link
               className={classes.carouselItem}
               to={`/coins/${coin.id}`}
            >
               <img
                  src={coin?.image}
                  alt={coin.name}
                  height="80"
                  style={{ marginBotton: 10 }}></img>
            </Link>
            <span style={{ userSelect: "none"}}>
            {coin?.symbol}
            &nbsp;
               <span>
                  {profit && "+"} {coin?.price_change_percentage_24h.toFixed(2)}%
               </span>
               <span style={{ fontSize: 22, fontWeight: 500}}>
                  {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
               </span>
            </span>
         </div>
      )
   })

   const responsive = {
      0: {
         items: 2,
      },
      512: {
         items: 4,
      },
   };

   return (
      <div className={classes.carousel}>
         <AliceCarousel
            mouseTracking
            infinite
            autoPlayInterval={1000}
            animationDuration={1500}
            disableDotsControls
            disableButtonsControls
            responsive={responsive}
            autoPlay
            items={items}
         />
      </div>
   )
}

export default Carousel