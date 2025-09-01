import {useState,createContext,useContext} from "react"
import axios from "axios"
const AuthContext=createContext();
import { Link } from "react-router-dom";

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);

    const login=async(username,password)=>{
        try{
        const res=await axios.post("http://localhost:8080/login",{
            username:username,
            password:password,
 });
if(res.statusText=="OK"){
        const token=localStorage.setItem("token",res.data.data.token);
            const userId=localStorage.setItem("userId",res.data.data._id);
            setUser(res.data.data);
        return true;
     }
     else{
        return alert(res.data.message);
     }
    }catch(e){
        return alert(e.message);
    }
}

return (
    <AuthContext.Provider value={{user,login}}>{children}</AuthContext.Provider>
)
};

export const useAuth=()=>{
   return  useContext(AuthContext);
}