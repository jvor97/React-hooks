import React, { useState, useEffect, useCallback, useReducer } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

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
  const http = useHttp();

  useEffect(() => {
    if (!http.isLoading && !http.error && http.identifier === "ADD_ING") {
      dispatch({
        type: "ADD",
        ingredient: http.extra
      });
    }
    if (!http.isLoading && !http.error && http.identifier === "DELETE_ING") {
      dispatch({ type: "DELETE", id: http.extra });
    }
  }, [http.identifier, http.extra, http.error]);

  //as we already call axios in search we dont need getting data from axios

  const addIngredientHandler = useCallback(
    ingredient => {
      http.submitHandler(
        "https://react-hooks-aa71d.firebaseio.com/ingredients.json",
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_ING"
      );
    },
    [http.submitHandler]
  );

  const filterIngHandler = useCallback(filterIng => {
    // setIngredients(filterIng);
    dispatch({ type: "SET", ingredients: filterIng });
  }, []);
  const removeIngredient = useCallback(
    id => {
      http.submitHandler(
        `https://react-hooks-aa71d.firebaseio.com/ingredients/${id}.json`,
        "DELETE",
        null,
        id,
        "DELETE_ING"
      );
      // axios
      //   .delete(`https://react-hooks-aa71d.firebaseio.com/ingredients/${id}.json`)
      //   .then(dispatchHttp({ type: "LOADING" }))
      //   .then(response => {
      //     // setLoading(false);
      //     // setIngredients(ingredients.filter(ing => ing.id !== id));
      //     dispatchHttp({ type: "SUCCESS" });
      //     dispatch({ type: "DELETE", id: id });
      //   })
      //   .catch(error => {
      //     // setLoading(false);
      //     // setError("Something went wrong");
      //     dispatchHttp({ type: "ERROR", errorMessage: error.message });
      //   });
    },
    [http.submitHandler]
  );

  return (
    <div className="App">
      {http.error && (
        <ErrorModal onClose={http.closeError}>{http.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={http.isLoading}
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
