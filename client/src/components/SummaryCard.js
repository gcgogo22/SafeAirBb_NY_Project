import React from "react";
import styles from "./SummaryCard.module.css";

function SummaryCard(props) {
  if (!props.summary) return <div></div>;
  // console.log(props.summary);
  return (
    <div>
      <ul className={styles.card}>
        <li>Total Listings: {props.summary.TotalListing}</li>
        <li>
          Average Price: ${props.summary.AveragePrice?.toFixed(2)} / night
        </li>
        <li>
          Average Listing Rating:{" "}
          {props.summary.AverageListingRating?.toFixed(2)}
        </li>
        <li>Average Crime Score: {props.summary.CrimeScore?.toFixed(2)}</li>
        <li>Museums: {props.summary.MuseumCount}</li>
        <li>Art Gallaries: {props.summary.ArtGalleryCount}</li>
        <li>Parks: {props.summary.ParkCount}</li>
      </ul>
    </div>
  );
}

export default SummaryCard;
