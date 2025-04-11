import React, { useState, useEffect} from "react";
import Cookies from 'js-cookie';

export function Profil() {
    function decodeJWT(token) {
        try {
            const [, payloadBase64] = token.split(".");
            const payload = JSON.parse(atob(payloadBase64));
            return payload;
        } catch (error) {
            console.error("Erreur de décodage du token :", error);
            return null;
        }
    }

    async function connect(pseudo,password){
        const url = 'https://gourmet.cours.quimerch.com/login';
        const options = {
            method: 'POST',
            headers: {Accept: 'application/json, application/xml', 'Content-Type': '*/*'},
            body: '{\n  "password": "'+password+'",\n  "username":"'+pseudo+'"\n}'
        };
    
        try {
            console.log(pseudo,password)
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);
            const tokenData = decodeJWT(data.token);
            console.log("Données du token :", tokenData);
            const expirationTimestamp = tokenData.exp*1000;
            const now = Date.now();
            const remainingTime = 60*60;
            if (remainingTime <= 0) {
            throw new Error("Le token est déjà expiré !");
            }
            Cookies.set('token', data.token, { expires: remainingTime / 86400, path: '/' });
            console.log("Token stocké avec une durée de", remainingTime, "secondes");
        } catch (error) {
            console.error(error);
        }
    }

    async function me(){
        const url = 'https://gourmet.cours.quimerch.com/me';
        const token = Cookies.get('token');
        const options = {method: 'GET', headers: {Accept: 'application/json, application/xml', 'Authorization': `Bearer ${token}`}};

        try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        setProfile(data)
        } catch (error) {
        console.error(error);
        }
    }
    const [password,setPassword] =useState("");
    const [pseudo,setPseudo] =useState("");
    const [profile,setProfile]=useState({})

    useEffect(() => {
        if(Cookies.get('token')){
            me();
            console.log(profile)
        }
    }, [Cookies.get('token')]);


    if(!Cookies.get('token')){
        return(
            <>
                <h1>Se connecter</h1>
                Pseudo
                <input value={pseudo} placeholder="Entrez votre pseudo" onChange={(e)=> setPseudo(e.target.value)}></input>
                Mot de passe
                <input value={password} type="password" placeholder="Entrez votre mot de passe" onChange={(e)=> setPassword(e.target.value)}></input>
                <button onClick={() => connect(pseudo, password)}> Se connecter </button>
            </>
        )
    }
    else{
    return(
        <>
            <h1>Accédez à votre profil depuis cette page</h1>
            Bienvenue {profile.username} 
        </>
    )}
}