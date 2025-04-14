import React, { useState, useEffect, useCallback} from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { JSX } from "react/jsx-runtime";

export function Searchbar(){
    const SearchIcon = FaSearch as React.FC;
    const [input,setInput] =useState("");
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
            const [recipe2, setRecipe2] = useState<Recipe[] | null>(null);
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState<string | null>(null);
            
            const fetchRecipes=useCallback(async (value : string) =>{
                const options = {method: 'GET', headers: {Accept: 'application/json, application/xml'}};
                try {
                    const response = await fetch('https://gourmet.cours.quimerch.com/recipes',options);
                    if (!response.ok) throw new Error("Erreur lors de la récupération des données");
    
                    const data : Recipe[] = await response.json();
                    const filteredRecipes = data.filter(recipe =>
                        recipe.name.toLowerCase().includes(value.toLowerCase())
                    );
                    setRecipe2(filteredRecipes);
                } catch (error) {
                    setError((error as Error).message);
                } finally {
                    setLoading(false);
                }
            },[])
            const HandleChange = (value:string)=>{
                setInput(value)
                fetchRecipes(value)
            }
            
            useEffect(() => {
                fetchRecipes(input);
            }, [input, fetchRecipes]);

            useEffect(() => {
                console.log("Recipe updated:", recipe2);
            }, [recipe2]);
                
        
            if (loading) return <p>Chargement...</p>;
            if (error) return <p>Erreur : {error}</p>;
            if (!recipe2) return <p>Aucune recette trouvée.</p>;

    return(
        <div className="search-div-container">
            <div className="input-container">
                <SearchIcon/>
                <input placeholder="Type to search" value={input} onChange={(e)=> HandleChange(e.target.value)}/>
            </div>
            { input && (
            <div className="results-list">
            {loading ? (
                <p>Chargement...</p>
            ) : recipe2.length>0 ?(
                          recipe2.map((reciped) => (
                            <Link to={{pathname:`/recipe/${reciped.id}`}}
                            onClick={() => setInput("")}
                            className="search-result-item">
                              <h2>{reciped.name}</h2>
                            </Link>
                          ))
            ):(
                <p>Aucune recette trouvée</p>
            )}
        </div>
    )
    
}</div>)}