import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { auth, realtimeDb } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const DbDataContext = createContext();
export const DbDataProvider =({children})=>{
    const [allYears,setAllYears]=useState([]);
    const [allVenues,setAllVenues]=useState([]);
    const [dbDataLoading,setIsDbDataLoading]=useState(true);

    useEffect(() => {
        let unsubscribeFromDb =null;
        const fetchYearsData=async()=>{
          setIsDbDataLoading(true);
        const yearsRef = ref(realtimeDb, 'allYears');
        unsubscribeFromDb = onValue(yearsRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setAllYears(Object.keys(data));
          } else {
            setAllYears([]);
          }
          setIsDbDataLoading(false);
        }, (error) => {
          console.error("Error fetching allYears:", error);
          setIsDbDataLoading(false);
        });
        }
      
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
          if(user){
            fetchYearsData()
          }
        })
        return ()=>{
          unsubscribe()
          if(unsubscribeFromDb) unsubscribeFromDb();
        }
      }, []);
      
    useEffect(() => {
        let unsubscribeFromDb=null;
        const fetchVenuesData=async()=>{
          setIsDbDataLoading(true);
        const venuesRef = ref(realtimeDb, 'allVenues');
        unsubscribeFromDb = onValue(venuesRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      setAllVenues(Object.keys(data));
    } else {
      setAllVenues([]);
    }
    setIsDbDataLoading(false);
  }, (error) => {
    console.error("Error fetching allVenues:", error);
    setIsDbDataLoading(false);
  });
        }
        const unsubscribe=onAuthStateChanged(auth,(user)=>{
          if(user){
            fetchVenuesData();
          }
        })

  return () =>{
    unsubscribe();
    if(unsubscribeFromDb) unsubscribeFromDb()
  }
}, []);

    return(
        <DbDataContext.Provider value={{allYears,allVenues,dbDataLoading}}>
            {children}
        </DbDataContext.Provider>
    )
}
DbDataProvider.propTypes={
    children:PropTypes.node,
}
export const useDbDataContext =()=>useContext(DbDataContext);