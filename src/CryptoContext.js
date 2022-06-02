import axios from 'axios';
import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { CoinList } from './config/api';

const Crypto = createContext()

const CryptoContext = ({ children }) => {
   const [currency, setCurrency] = useState("USD");
   const [symbol, setSymbol] = useState("$");
   const [coins, setCoins] = useState([]);
   const [loading, setLoading] = useState(false);

   const [user, setUser] = useState(null);
   const [alert, setAlert] = useState({
      open: false,
      message: "",
      type: "success",
   });

   const fetchCoins = async () => {
      setLoading(true);
      const { data } = await axios.get(CoinList(currency));
  
      setCoins(data);
      setLoading(false);
    };

   useEffect(() => {
      if (currency === "USD") setSymbol("$");
      else if (currency === "CNY") setSymbol("¥");

      fetchCoins();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currency])


   return <Crypto.Provider value={{currency, symbol, setCurrency, coins, loading, alert, setAlert, fetchCoins}}>{children}</Crypto.Provider>
}

export default CryptoContext;

export const CryptoState = () => {
   return useContext(Crypto);
};