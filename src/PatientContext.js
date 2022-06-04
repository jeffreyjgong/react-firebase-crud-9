import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { CoinList } from './config/api';
import { auth, db } from './firebase';

const Role = createContext()

const RoleContext = ({ children }) => {
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

   const [patientlist, setPatientlist] = useState([]);

   useEffect(() => {
      if (user) {
         const coinRef = doc(db, "patientlist", user.uid);

         var unsubscribe = onSnapshot(coinRef, coin=> {
            if (coin.exists()) {
               setPatientlist(coin.data().coins);
            } else {
               console.log("No Items in Watchlist");
            }
         });
         return () => {
            unsubscribe();
         }
      }

      
   }, [user]);

   useEffect(() => {
      onAuthStateChanged(auth, user=> {
         if (user) setUser(user);
         else setUser(null);
      });
   }, []);

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


   return <Role.Provider value={{currency, symbol, setCurrency, coins, loading, alert, setAlert, fetchCoins, user, patientlist}}>{children}</Role.Provider>
}

export default RoleContext;

export const RoleState = () => {
   return useContext(Role);
};