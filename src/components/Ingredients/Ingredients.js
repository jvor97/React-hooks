import React, { useState, useEffect } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  console.log(ingredients);
  useEffect(() => {
    axios
      .get("https://react-hooks-aa71d.firebaseio.com/ingredients.json")
      .then(response => {
        let loadedIng = [];
        for (const key in response.data) {
          loadedIng.push({
            title: response.data[key].title,
            amount: response.data[key.amount],
            id: key
          });
        }
        setIngredients(loadedIng);
        console.log(response.data);
      });
  }, []);

  const n = ingredient => {
    axios
      .post(
        "https://react-hooks-aa71d.firebaseio.com/ingredients.json",
        ingredient
      )
      .then(response => {
        setIngredients(
          ingredients.concat({ ...ingredient, id: Math.random().toString() })
        );
      });
  };

  const removeIngredient = id => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const filterIngHandler 
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onFilterIng={filterIngHandler}/>
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredient}
        />
      </section>
    </div>
  );
}

export default Ingredients;
