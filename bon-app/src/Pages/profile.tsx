import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';

export function Profil() {

    const [error, setError] = useState<string | null>(null);

    async function connect(pseudo: string, password: string) {
        const url = 'https://gourmet.cours.quimerch.com/login';
        const options = {
            method: 'POST',
            headers: { Accept: 'application/json, application/xml', 'Content-Type': '*/*' },
            body: '{\n  "password": "' + password + '",\n  "username":"' + pseudo + '"\n}'
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const data = await response.json();
                setError(`Erreur: ${data.message}`);
                return;
            }
            const data = await response.json();
            const remainingTime = 60 * 60;
            if (remainingTime <= 0) {
                throw new Error("Le token est déjà expiré !");
            }
            Cookies.set('token', data.token, { expires: remainingTime / 86400, path: '/' });
            window.location.reload();
        } catch (error) {
            setError("Erreur lors de la connexion");
            console.error(error);
        }
    }

    async function disconnect() {
        const url = 'https://gourmet.cours.quimerch.com/logout';
        const options = { method: 'GET', headers: { Accept: 'application/json, application/xml', 'Authorization': `Bearer ${token}`} };

        try {
            const response = await fetch(url, options);
            if (response.ok) {
                Cookies.remove('token');
                window.alert("Votre session a expiré, veuillez vous reconnecter");
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const [password, setPassword] = useState("");
    const [pseudo, setPseudo] = useState("");
    interface Profile {
        username: string;
        [key: string]: any; // To allow additional properties if needed
    }

    const [profile, setProfile] = useState<Profile | null>(null);
    const token = Cookies.get('token');

    useEffect(() => {
        async function me() {
            const url = 'https://gourmet.cours.quimerch.com/me';
            const options = { method: 'GET', headers: { Accept: 'application/json, application/xml', 'Authorization': `Bearer ${token}` } };

            try {
                const response = await fetch(url, options);
                const data = await response.json();
                if (data.title === "Unauthorized") {
                    alert("Votre session a expiré, veuillez vous reconnecter");
                    Cookies.remove("token");
                    window.alert("Votre session a expiré, veuillez vous reconnecter");
                    window.location.reload();
                }
                else {
                    setProfile(data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (token) {
            me();
        }
    }, [token]);

    if (!token) {
        return (
            <div className="login-container">
                <h1>Connexion</h1>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label htmlFor="pseudo">Pseudo</label>
                    <input
                        id="pseudo"
                        value={pseudo}
                        placeholder="Entrez votre pseudo"
                        onChange={(e) => setPseudo(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        id="password"
                        value={password}
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="button" onClick={() => connect(pseudo, password)}>
                    Se connecter
                </button>
            </div>
        )}
    else {
        return (
            <div className="login-container">
                <h1>Votre Profil</h1>
                {profile && <p className="welcome-text">Bienvenue {profile.username}</p>}
                <button className="button" onClick={() => disconnect()}>
                    Se déconnecter
                </button>
            </div>
        )
    }
}

export default Profil;