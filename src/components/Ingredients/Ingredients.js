import React, { useState, useCallback, useReducer } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIng, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return currentIng.concat({ ...action.ingredient });
    case "DELETE":
      return currentIng.filter(ing => ing.id !== action.id);
    default:
      break;
  }
};

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  // const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log(ingredients);
  // useEffect(() => {
  //   axios
  //     .get("https://react-hooks-aa71d.firebaseio.com/ingredients.json")
  //     .then(response => {
  //       let loadedIng = [];
  //       for (const key in response.data) {
  //         loadedIng.push({
  //           title: response.data[key].title,
  //           amount: response.data[key.amount],
  //           id: key
  //         });
  //       }
  //       setIngredients(loadedIng);
  //       console.log(response.data);
  //     });
  // }, []);
  //as we already call axios in search we dont need it

  const addIngredientHandler = ingredient => {
    axios
      .post(
        "https://react-hooks-aa71d.firebaseio.com/ingredients.json",
        ingredient
      )
      .then(setLoading(true))
      .then(response => {
        setLoading(false);
        // setIngredients(
        //   ingredients.concat({ ...ingredient, id: Math.random().toString() })
        // );
        dispatch({ type: "ADD", ingredient: ingredient });
      })
      .catch(error => {
        setLoading(false);
        setError("Something went wrong");
      });
  };

  const filterIngHandler = useCallback(filterIng => {
    // setIngredients(filterIng);
    dispatch({ type: "SET", ingredients: filterIng });
  }, []);

  const removeIngredient = id => {
    axios
      .delete(`https://react-hooks-aa71d.firebaseio.com/ingredients/${id}.json`)
      .then(setLoading(true))
      .then(response => {
        setLoading(false);
        // setIngredients(ingredients.filter(ing => ing.id !== id));
        dispatch({ type: "DELETE", id: id });
      })
      .catch(error => {
        setLoading(false);
        setError("Something went wrong");
      });
  };

  return (
    <div className="App">
      {error && (
        <ErrorModal onClose={() => setError(false)}>{error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={loading}
      />

      <section>
        <Search onFilterIng={filterIngHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredient}
        />
      </section>
    </div>
  );
}

export default Ingredients;
