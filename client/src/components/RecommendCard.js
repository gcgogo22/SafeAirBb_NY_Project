import React from "react";
import styles from "./RecommendCard.module.css";

function RecommendCard(props) {
  const onClickHandler = () => {
    if (props.clickfrom === "listing_detail") {
      const listingDetailURL = `./${props.id}`;
      window.open(listingDetailURL, "_blank");
    } else if (props.clickfrom === "neighborhood") {
      const listingDetailURL = `./listingdetail/${props.id}`;
      window.open(listingDetailURL, "_blank");
    }
  };

  return (
    <div className={styles.card} onClick={onClickHandler}>
      <img src={props.src} alt="" />
      <div className={styles.card__info}>
        <h2>{props.title}</h2>
        <h4>{props.description}</h4>
        <h3>{props.price}</h3>
      </div>
    </div>
  );
}

export default RecommendCard;
