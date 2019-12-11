import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";
import axios from "axios";
import useHttp from "../../hooks/http";

const Search = React.memo(props => {
  const [filterIng, setFilterIng] = useState("");
  const { onFilterIng } = props;
  const inputRef = useRef();
  const http = useHttp();

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (filterIng === inputRef.current.value) {
        let query =
          filterIng.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${filterIng}"`;
        http.submitHandler(
          "https://react-hooks-aa71d.firebaseio.com/ingredients.json" + query,
          "GET"
        );
        // axios
        //   .get(
        //     "https://react-hooks-aa71d.firebaseio.com/ingredients.json" + query
        //   )
        //   .then(response => {
        //     let loadedIng = [];
        //     for (const key in response.data) {
        //       loadedIng.push({
        //         title: response.data[key].title,
        //         amount: response.data[key].amount,
        //         id: key
        //       });
        //     }
        //     onFilterIng(loadedIng);
        //   });
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [filterIng, inputRef, http.submitHandler]);

  useEffect(() => {
    console.log(http.data);
    if (!http.isLoading && !http.error && http.data) {
      let loadedIng = [];
      for (const key in http.data) {
        loadedIng.push({
          title: http.data[key].title,
          amount: http.data[key].amount,
          id: key
        });
      }
      onFilterIng(loadedIng);
    }
  }, [http.isLoading, http.data, onFilterIng, http.error]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={filterIng}
            onChange={e => setFilterIng(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
