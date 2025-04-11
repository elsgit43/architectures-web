import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import { IconType } from "react-icons";
import Cookies from "js-cookie";

export function Recipe() {
  const { id } = useParams();
  const token=Cookies.get('token');
  const FaHeart: IconType = FaIcons.FaHeart;
  const FaRegHeart: IconType = FaIcons.FaRegHeart;
  const FaHeartBroken: IconType = FaIcons.FaHeartBroken;
  const [recipe, setRecipe] = useState<{
    name: string;
    description: string;
    cook_time: number;
    cost: number;
    image_url: string;
    prep_time: number;
    servings: number;
    when_to_eat: string;
    instructions: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const options = { method: 'GET', headers: { Accept: 'application/json, application/xml' } };
  const [isFavorite, setIsFavorite] = useState(false);
  console.log(id);

  useEffect(() => {
    async function fetchRecipe() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://gourmet.cours.quimerch.com/recipes/${id}`, options);
        console.log(response);
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
  }, [id]);

  useEffect(() => {
    async function Favorite(){
      if(isFavorite){
        const url = `https://gourmet.cours.quimerch.com/users/nu/favorites?recipeID=${id}`;
      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json, application/xml',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },

      };
  
      try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
      }
    };
    Favorite();
  },[isFavorite])

  const [isHovered, setIsHovered] = useState(false);

  const toggleFavorite=() => {
    setIsFavorite(!isFavorite);
  };
  

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{recipe?.name ?? "Nom non disponible"}</h1>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
  <button
    onClick={toggleFavorite}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1.8em",
      display: "flex",
      alignItems: "center",
    }}
    aria-label="Ajouter aux favoris"
  >
    {isFavorite ? (
      isHovered ? (
        <FaHeartBroken color="red" />
      ) : (
        <FaHeart color="red" />
      )
    ) : (
      isHovered ? (
        <FaRegHeart color="red" />
      ) : (
        <FaRegHeart color="gray" />
      )
      
    )}
  </button>
        <span style={{ marginLeft: "10px", fontSize: "1.2em", alignSelf:"screenLeft"}}>Ajouter aux favoris</span></div>
      {recipe?.image_url && <img src={recipe.image_url} alt={recipe?.name} style={styles.image} />}
      
      <div style={styles.details}>
        <div style={styles.detailItem}><strong>Temps de cuisson :</strong> {recipe?.cook_time ?? "Non indiqué"} min</div>
        <div style={styles.detailItem}><strong>Temps de préparation :</strong> {recipe?.prep_time ?? "Non indiqué"} min</div>
        <div style={styles.detailItem}><strong>Nombre de portions :</strong> {recipe?.servings ?? "Non indiqué"}</div>
        <div style={styles.detailItem}><strong>Type de plat :</strong> {recipe?.when_to_eat ?? "Non indiqué"}</div>
      </div>

      <div style={styles.description}>
        <p><strong>Description :</strong> {recipe?.description ?? "Description non disponible"}</p>
      </div>

      <div style={styles.instructions}>
        <h2>Recette :</h2>
        <div>{recipe?.instructions ?? "Non indiqué"}</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '800px',
    margin: 'auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    color: '#333',
    fontSize: '2.5em',
    marginBottom: '10px',
  },
  image: {
    display: 'block',
    margin: '20px auto',
    borderRadius: '8px',
    maxWidth: '100%',
  },
  details: {
    marginBottom: '20px',
    fontSize: '1.2em',
    lineHeight: '1.6',
  },
  detailItem: {
    marginBottom: '10px',
  },
  description: {
    fontSize: '1.2em',
    marginBottom: '20px',
  },
  instructions: {
    fontSize: '1.2em',
    lineHeight: '1.8',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
};
