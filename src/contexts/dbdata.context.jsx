import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { realtimeDb } from "../firebase";

const DbDataContext = createContext();
export const DbDataProvider =({children})=>{
    const [allYears,setAllYears]=useState([]);
    const [allVenues,setAllVenues]=useState([]);
    const [dbDataLoading,setIsDbDataLoading]=useState(true);

    useEffect(() => {
        setIsDbDataLoading(true);
        const yearsRef = ref(realtimeDb, 'allYears');
        const unsubscribe = onValue(yearsRef, (snapshot) => {
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
      
        return () => unsubscribe();
      }, []);
      
    useEffect(() => {
        setIsDbDataLoading(true);
        const venuesRef = ref(realtimeDb, 'allVenues');
        const unsubscribe = onValue(venuesRef, (snapshot) => {
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

  return () => unsubscribe();
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