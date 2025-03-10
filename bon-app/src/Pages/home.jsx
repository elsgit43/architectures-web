import React from 'react';
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';


export function Home() {
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Page d'accueil projet d'ArchiWeb
            </p>

            <a
              className="App-link"
              href="https://www.youtube.com/watch?v=AyMOS5rNx-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              NE PAS CLIQUER SUR CE LIEN
            </a>
          </header>
        </div>
      );
}