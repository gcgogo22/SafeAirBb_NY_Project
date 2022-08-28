import React, { useState, useEffect } from "react";
import styles from "./Search.module.css";
import PageNavbar from "../components/PageNavbar";
import SearchBar from "../components/SearchBar";
import ListingCard from "../components/ListingCard";
import { getSearchResults } from "../api/ApiCalls";

function Search() {
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [list, setList] = useState(null);

  useEffect(() => {
    getSearchResults(searchCriteria, setList);
  }, [searchCriteria]);

  // if (list && list.length > 0) console.log(list);

  let searchResultContent = (
    <h1 className={styles.default_message}>
      Please choose your search criteria.
    </h1>
  );

  if (list && list.length === 0) {
    searchResultContent = (
      <h1 className={styles.default_message}>
        No lising match your search criteria.
      </h1>
    );
  }

  if (list && list.length > 0) {
    searchResultContent = (
      <section>
        {list.map((li) => {
          const description = `${li.accommodates} guest · ${li.bedrooms} bedroom · ${li.beds} bed · ${li.bathrooms} bathroom`;
          const review = li.review_scores_rating
            ? li.review_scores_rating
            : "No Review";
          const price = `$${li.price} / night`;
          let isSuperhost = true;
          if (!li.host_is_superhost || li.host_is_superhost === "f") {
            isSuperhost = false;
          }
          return (
            <ListingCard
              key={li.listing_id}
              id={li.listing_id}
              img={li.picture_url}
              type={li.property_type}
              name={li.name}
              description={description}
              review={review}
              price={price}
              superhost={isSuperhost}
              crime={li.crime_level}
            />
          );
        })}
      </section>
    );
  }

  return (
    <div>
      <PageNavbar />
      <SearchBar onSearchSubmit={setSearchCriteria} />
      {searchResultContent}
    </div>
  );
}

export default Search;
