import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";
import axios from "axios";

const Search = React.memo(props => {
  const [filterIng, setFilterIng] = useState("");
  const { onFilterIng } = props;

  useEffect(() => {
    let query =
      filterIng.length === 0 ? "" : `?orderBy="title"&equalTo="${filterIng}"`;
    axios
      .get("https://react-hooks-aa71d.firebaseio.com/ingredients.json" + query)
      .then(response => {
        let loadedIng = [];
        for (const key in response.data) {
          loadedIng.push({
            title: response.data[key].title,
            amount: response.data[key.amount],
            id: key
          });
        }
        onFilterIng(loadedIng);
      });
  }, [filterIng, onFilterIng]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
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
