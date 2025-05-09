import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { JSX } from "react/jsx-runtime";
import defaultImage from '../assets/default-image.png';

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

export function Favorites() {
  const token=Cookies.get('token');
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);
          
  useEffect(() => {
    
      const fetchRecipe = async () => {
        if(!token){
          setError("Vous devez être connecté pour accéder à cette page");
          setLoading(false);
          return;
        }
          try {
              const options = {method: 'GET', headers: {Accept: 'application/json, application/xml', 'Authorization': `Bearer ${token}`}};
              const response = await fetch('https://gourmet.cours.quimerch.com/favorites',options);
              
              const data = await response.json();
                if (data.title === "Unauthorized") {
                  window.location.assign('/profile');
                }
                if (!response.ok) throw new Error("Erreur lors de la récupération des données");
                if(data){
                  for(let i=0; i<data.length; i++){
                  data[i]=data[i].recipe;
                  }
                }
              setRecipes(data);
          } catch (err: any) {
            setError(err.message);
          } finally {
              setLoading(false);
          }
      }
      
        fetchRecipe();
  }, [token]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!recipes || recipes.length === 0) return <p>Vous n'avez pas encore de favoris. Vous pouvez en ajouter <Link to={"/"}>ici</Link> !</p>;
  return(
        <>
            <h1>Consultez ici vos favoris</h1>
            <div className="recipe-grid">
                          {recipes.map((reciped) => (
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
        </>
    )
}

export default Favorites;