import React, { useEffect, useState } from "react"
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import { JSX } from "react/jsx-runtime";


export function Home() {

        interface Recipe{
            map(arg0: (reciped: any) => JSX.Element): React.ReactNode;
            calories: number;
            category: string;
            cook_time: number;
            cost: number;
            created_at: Date;
            created_by: string;
            description: string;
            disclaimer: string;
            id: string;
            image_url: string;
            instructions: string;
            name: string;
            prep_time: number;
            published: boolean;
            servings: number;
            when_to_eat: string
        }
        const [recipe, setRecipe] = useState<Recipe | null>(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const options = {method: 'GET', headers: {Accept: 'application/json, application/xml'}};
    
        useEffect(() => {
            async function fetchRecipe() {
                try {
                    const response = await fetch('https://gourmet.cours.quimerch.com/recipes',options);
                    if (!response.ok) throw new Error("Erreur lors de la récupération des données");
    
                    const data = await response.json();
                    console.log(data)
                    setRecipe(data);
                } catch (error) {
                    setError((error as Error).message);
                } finally {
                    setLoading(false);
                }
            }
    
            fetchRecipe();
        }, []);
    
        if (loading) return <p>Chargement...</p>;
        if (error) return <p>Erreur : {error}</p>;
        if (!recipe) return <p>Aucune recette trouvée.</p>;
    
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Page d'accueil projet d'ArchiWeb
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {recipe.map((reciped) => (
                <Link key={reciped.id} to={{pathname:`/recipe/${reciped.id}`}}>
                <div style={{
                  border: "1px solid #ddd",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                  maxWidth: "300px",
                  maxHeight:"400px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  
                  <img src={reciped.image_url} width="100%" alt={reciped.name}></img>
                  <h2>{reciped.name}</h2>
                  <p>{reciped.instructions}</p>
                  
                </div>
                </Link>
              ))}
            </div>
          </header>
        </div>
      );
}