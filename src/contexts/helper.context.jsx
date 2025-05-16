import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const HelperContext = createContext()
export const HelperProvider=({children})=>{
    const [page,setPage]=useState('')
    const [globalData,setGlobalData]=useState([])
    const [xlsxName,setXlsxName]=useState('');
    const router = useNavigate()
    const handleSetGlobalData=(d)=>setGlobalData(d);
    const handleSetXlsxName=(name)=>setXlsxName(name);
    const handleSetPage=(p)=>setPage(p);
    const handleNavIconClick=(name)=>{
        const route = name.replace(/\s/g,'-').toLowerCase();
        router(route)
        setPage(name)
    }
    return(
        <HelperContext.Provider value={{page,handleNavIconClick,globalData,handleSetGlobalData,handleSetPage,xlsxName,handleSetXlsxName}}>
            {children}
        </HelperContext.Provider>
    )
}
export const useHelperContext =()=>useContext(HelperContext);