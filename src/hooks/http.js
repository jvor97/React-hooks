import { useCallback, useReducer } from "react";

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case "SUCCESS":
      return {
        ...currentHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
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
    data: null,
    extra: null,
    identifier: null
  });
  const submitHandler = useCallback((url, method, body, extra, identifier) => {
    dispatchHttp({ type: "LOADING", identifier: identifier });
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
        dispatchHttp({
          type: "SUCCESS",
          responseData: responseData,
          extra: extra
        });
      })
      .catch(error => {
        dispatchHttp({ type: "ERROR", errorMessage: error.message });
      });
  }, []);

  const closeError = useCallback(() => {
    dispatchHttp({ type: "CLOSE_ERROR" });
  }, []);
  console.log(httpState.data);
  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.responseData,
    submitHandler: submitHandler,
    extra: httpState.extra,
    identifier: httpState.identifier,
    closeError: closeError
  };
};

export default useHttp;
