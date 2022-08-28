import React, { useState } from "react";
import styles from "./SearchBar.module.css";
import { Button } from "@material-ui/core";

function SearchBar(props) {
  const [boroughVal, setBoroughVal] = useState("Manhattan");
  const [priceMin, setPriceMin] = useState(1);
  const [priceMax, setPriceMax] = useState(100000);
  const [crimeVal, setCrimeVal] = useState("A");
  const [accommodatesVal, setAccommodatesVal] = useState(1);
  const [isChecked, setIsChecked] = useState(false);
  const [orderBy, setOrderBy] = useState("price_low");

  const boroughSelectHandler = (event) => {
    setBoroughVal(event.target.value);
  };

  const priceMinHandler = (event) => {
    setPriceMin(event.target.value);
  };

  const priceMaxHandler = (event) => {
    setPriceMax(event.target.value);
  };

  const crimeSelectHandler = (event) => {
    setCrimeVal(event.target.value);
  };

  const accommodatesHandler = (event) => {
    setAccommodatesVal(event.target.value);
  };

  const superhostHandler = (event) => {
    setIsChecked(event.target.checked);
  };

  const orderByHandler = (event) => {
    setOrderBy(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const searchCriteria = {
      borough: boroughVal,
      price_min: priceMin,
      price_max: priceMax,
      crime_rate: crimeVal,
      accommodates: accommodatesVal,
      is_superhost: isChecked,
      order_by: orderBy,
    };
    props.onSearchSubmit(searchCriteria);
  };

  return (
    <div className={styles.searchbar}>
      <h1>Search Listings</h1>
      <form className={styles.form} onSubmit={submitHandler}>
        <div className={styles.grid_one}>
          <label>Borough: </label>
          <select value={boroughVal} onChange={boroughSelectHandler}>
            <option value="Manhattan">Manhattan</option>
            <option value="Brooklyn">Brooklyn</option>
            <option value="Queens">Queens</option>
            <option value="Bronx">Bronx</option>
            <option value="Staten Island">Staten Island</option>
          </select>
        </div>
        <div className={styles.grid_two}>
          <label>Price: </label>
          <label>Min</label>
          <input type="number" onChange={priceMinHandler} />
          <label>Max</label>
          <input type="number" onChange={priceMaxHandler} />
        </div>
        <div className={styles.grid_three}>
          <label>Crime Rating: </label>
          <select value={crimeVal} onChange={crimeSelectHandler}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
        </div>
        <div className={styles.grid_four}>
          <label>Accommodates: </label>
          <input type="number" onChange={accommodatesHandler} />
        </div>
        <div className={styles.grid_five}>
          <label>Super Host: </label>
          <input
            type="checkbox"
            className={styles.checkbox}
            onChange={superhostHandler}
          />
          <label>Order By: </label>
          <select value={orderBy} onChange={orderByHandler}>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="review">Review Score</option>
            <option value="crime">Crime Rating</option>
          </select>
        </div>

        <Button
          type="submit"
          className={styles.search__button}
          variant="outlined"
        >
          Search
        </Button>
      </form>
    </div>
  );
}

export default SearchBar;
