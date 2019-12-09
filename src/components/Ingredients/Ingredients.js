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

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "SUCCESS":
      return { ...currentHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLOSE_ERROR":
      return { ...currentHttpState, error: null };
    default:
      break;
  }
};

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null
  });
  // const [ingredients, setIngredients] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  console.log(ingredients);
  //as we already call axios in search we dont need getting data from axios

  const addIngredientHandler = ingredient => {
    axios
      .post(
        "https://react-hooks-aa71d.firebaseio.com/ingredients.json",
        ingredient
      )
      .then(dispatchHttp({ type: "LOADING" }))
      .then(response => {
        // setLoading(false);
        // setIngredients(
        //   ingredients.concat({ ...ingredient, id: Math.random().toString() })
        // );
        dispatchHttp({ type: "SUCCESS" });
        dispatch({ type: "ADD", ingredient: ingredient });
      })
      .catch(error => {
        // setLoading(false);
        dispatchHttp({ type: "ERROR", errorMessage: error.message });
        // setError("Something went wrong");
      });
  };

  const filterIngHandler = useCallback(filterIng => {
    // setIngredients(filterIng);
    dispatch({ type: "SET", ingredients: filterIng });
  }, []);

  const removeIngredient = id => {
    axios
      .delete(`https://react-hooks-aa71d.firebaseio.com/ingredients/${id}.json`)
      .then(dispatchHttp({ type: "LOADING" }))
      .then(response => {
        // setLoading(false);
        // setIngredients(ingredients.filter(ing => ing.id !== id));
        dispatchHttp({ type: "SUCCESS" });
        dispatch({ type: "DELETE", id: id });
      })
      .catch(error => {
        // setLoading(false);
        // setError("Something went wrong");
        dispatchHttp({ type: "ERROR", errorMessage: error.message });
      });
  };

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={() => dispatchHttp({ type: "CLOSE_ERROR" })}>
          {httpState.error}
        </ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
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
