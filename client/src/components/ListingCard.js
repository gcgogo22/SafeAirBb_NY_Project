import React from "react";
import styles from "./ListingCard.module.css";
import StarIcon from "@mui/icons-material/Star";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

function ListingCard(props) {
  const listingDetailURL = `./listingdetail/${props.id}`;
  // console.log(props);

  return (
    <div
      onClick={() => {
        window.open(listingDetailURL, "_blank");
      }}
      className={styles.searchResult}
    >
      <img src={props.img} alt="" />
      {props.superhost ? (
        <p className={styles.searchResult__superhost}>SUPERHOST</p>
      ) : (
        ""
      )}
      <div className={styles.searchResult__info}>
        <div className={styles.searchResult__infoTop}>
          <p>{props.type}</p>
          <h3>{props.name}</h3>
          <p>____</p>
          <p>{props.description}</p>
        </div>
        <div className={styles.searchResult__infoBottom}>
          <div className={styles.searchResult__stars}>
            <StarIcon className={styles.searchResult__star} />
            <p>
              <strong>{props.review}</strong>
            </p>
          </div>
          <div className={styles.searchResult__stars}>
            <HealthAndSafetyIcon className={styles.searchResult__star} />
            <p>
              Crime Rating: <strong>{props.crime}</strong>
            </p>
          </div>
          <div className={styles.searchResult__price}>
            <h2>{props.price}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
