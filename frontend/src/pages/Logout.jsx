import { useEffect } from "react";

export default function Logout(){
    useEffect(()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        return window.location.href="/login"
    })
}