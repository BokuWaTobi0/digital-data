import {  useState,useEffect } from "react"
import { Routes,Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useUserAuthContext } from "./contexts/user-auth.context";
import AuthLoader from "./components/auth-loader/auth-loader.component";
import Auth from "./routes/auth/auth.component";
import Menubar from "./components/menubar/menubar.component";
import Home from "./routes/home/home.component";
import User from "./routes/user/user.component";
import Create from "./routes/create/create.component";
import Search from "./routes/search/search.component";
import Editor from "./routes/editor/editor.component";

function App() {
    const [isLoading,setIsLoading]=useState(true);
    const {user,handleSetUser}=useUserAuthContext();

    useEffect(() => {
      const checkAuthState = async () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if(user){
            handleSetUser(user);
            setIsLoading(false);
          }else{
            setIsLoading(false);
            handleSetUser(null);
          }
        });
        return () => unsubscribe();
      };
      setIsLoading(true);
      checkAuthState();      
    }, [handleSetUser]);

    if(isLoading) return <AuthLoader/>
    if(!user) return <Auth/>

  return (
    <Routes>
      <Route path="/" element={<Menubar/>} >
        <Route index element={<Home/>} />
        <Route path="user" element={<User/>} />
        <Route path="create" element={<Create/>} />
        <Route path="search" element={<Search/>} />
        <Route path="editor/:id" element={<Editor/>} />
      </Route>
    </Routes>
  )
}

export default App
