import { useCallback, useReducer } from "react";

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null, data: null };
    case "SUCCESS":
      return { ...currentHttpState, loading: false, data: action.responseData };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLOSE_ERROR":
      return { ...currentHttpState, error: null };
    default:
      break;
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null
  });
  const submitHandler = useCallback((url, method, body) => {
    dispatchHttp({ type: "LOADING" });
    fetch(url, {
      method: method,
      body: body,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        dispatchHttp({ type: "SUCCESS", responseData: responseData });
      })
      .catch(error => {
        dispatchHttp({ type: "ERROR", errorMessage: error.message });
      });
  }, []);
  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.responseData,
    submitHandler: submitHandler
  };
};

export default useHttp;
