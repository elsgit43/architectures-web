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
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.ok) {
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
                window.location.reload();
            }
            else {
                console.error("Erreur lors de la connexion :", data.title);
                alert("Erreur lors de la connexion : " + data.title);
            }
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
        if (data.title== "Unauthorized") {
            alert("Votre session a expiré, veuillez vous reconnecter");
            disconnect();
        }
        else{
            console.log(data);
            setProfile(data)
    }
        } catch (error) {
        console.error(error);
        }
    }

    async function disconnect(){
        const url = 'https://gourmet.cours.quimerch.com/logout';
        const options = {method: 'GET', headers: {Accept: 'application/json, application/xml'}};

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);
            Cookies.remove('token');
            window.location.reload();
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
            <div className="login-container">
                <h1>Se connecter</h1>
                <div className="form-group">
                    <label>Pseudo</label>
                    <input 
                        value={pseudo} 
                        placeholder="Entrez votre pseudo" 
                        onChange={(e)=> setPseudo(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Mot de passe</label>
                    <input 
                        value={password} 
                        type="password" 
                        placeholder="Entrez votre mot de passe" 
                        onChange={(e)=> setPassword(e.target.value)}
                    />
                </div>
                <button className="button" onClick={() => connect(pseudo, password)}>
                    Se connecter
                </button>
            </div>
        )
    }
    else{
        return(
            <div className="login-container">
                <h1>Votre Profil</h1>
                <p className="welcome-text">Bienvenue {profile.username}</p>
                <button className="button" onClick={() => disconnect()}>
                    Se déconnecter
                </button>
            </div>
        )}
}