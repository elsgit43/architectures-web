import React, { useEffect, useState } from "react"
import { Link } from 'react-router-dom';
import { JSX } from "react/jsx-runtime";
import defaultImage from '../assets/default-image.png';


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
    
        useEffect(() => {
            const options = {method: 'GET', headers: {Accept: 'application/json, application/xml'}};
            async function fetchRecipe() {
                try {
                    const response = await fetch('https://gourmet.cours.quimerch.com/recipes',options);
                    if (!response.ok) throw new Error("Erreur lors de la récupération des données");
    
                    const data = await response.json();
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
            <div className="recipe-grid">
              {recipe.map((reciped) => (
                <Link
                key={reciped.id}
                to={{pathname:`/recipe/${reciped.id}`}}
                style={{textDecoration:'none'}}>
                <div className="recipe-card">
                  <img src={reciped.image_url || defaultImage} alt={reciped.name}></img>
                  <div className="recipe-card-content">
                  <h2>{reciped.name}</h2>
                  <p>{reciped.description}</p>
                  </div>
                  
                </div>
                </Link>
              ))}
            </div>
          </header>
        </div>
      );
}

export default Home;