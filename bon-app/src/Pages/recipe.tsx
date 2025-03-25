import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

export function Recipe() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<{ name: string; description: string; cook_time: number, cost: number, image_url : string, prep_time : number, servings : number, when_to_eat : string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const options = {method: 'GET', headers: {Accept: 'application/json, application/xml'}};
    
    console.log(id)

    useEffect(() => {
        async function fetchRecipe() {
            if (!id) return;
                setLoading(true);
                setError(null);
            try {
                const response = await fetch(`https://gourmet.cours.quimerch.com/recipes/${id}`,options);
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

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <div>
            <h1>Recette : {recipe?.name ?? "Nom non disponible"}</h1>
            <div>Temps de cuisson : {recipe?.cook_time ?? "Non indiqué"}</div>
            <div>Temps de préparation : {recipe?.prep_time ?? "Non indiqué"}</div>
            <div>Nombre de portions : {recipe?.servings ?? "Non indiqué"}</div>
            <div>A manger : {recipe?.when_to_eat ?? "Non indiqué"}</div>
            <p>{recipe?.description ?? "Description non disponible"}</p>
        </div>
    );
}