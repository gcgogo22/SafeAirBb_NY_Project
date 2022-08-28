import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ListingDetail.module.css";
import PageNavbar from "../components/PageNavbar";
import { getListingDetail, getRecommendedList } from "../api/ApiCalls";
import StarIcon from "@mui/icons-material/Star";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import RecommendCard from "../components/RecommendCard";
import { Button } from "@material-ui/core";

function ListingDetail() {
  const params = useParams();
  const [detail, setDetail] = useState(null);
  const [simList, setSimList] = useState(null);
  useEffect(() => {
    getListingDetail(params.id, setDetail);
    getRecommendedList(params.id, setSimList);
  }, [params.id]);

  // if (simList) console.log(simList);

  let content = <div></div>;

  if (detail && simList) {
    let museumList = "There is no museum nearby...";
    let artGallaryList = "There is no art gallay nearby...";
    let parkList = "There is no park nearby...";

    if (detail.MuseumCount && detail.MuseumCount > 0) {
      museumList = detail.MuseumList.replaceAll(",", "\n");
    }

    if (detail.ArtGalleryCount && detail.ArtGalleryCount > 0) {
      artGallaryList = detail.ArtGalleryList.replaceAll(",", "\n");
    }

    if (detail.ParkCount && detail.ParkCount > 0) {
      parkList = detail.ParkList.replaceAll(",", "\n");
    }

    let description = "";
    if (detail.description) {
      description = detail.description;
      description = description.replaceAll("<br />", "\n");
      description = description.replaceAll("<b>", "");
      description = description.replaceAll("</b>", "");
    }

    content = (
      <div className={styles.container}>
        <section className={styles.sec_one}>
          <h2>{detail.name}</h2>
          <div className={styles.review_container}>
            <div className={styles.review__stars}>
              <StarIcon className={styles.review__star} />
              <p>
                <strong>{detail.review_scores_rating}</strong>
                {` (${detail.number_of_reviews} reviews)`}
              </p>
            </div>
            <div className={styles.review__stars}>
              <HealthAndSafetyIcon className={styles.review__star} />
              <p>
                Crime Rating: <strong>{detail.crime_level}</strong>
              </p>
            </div>
            {detail.host_is_superhost === "t" ? (
              <p className={styles.review__superhost}>SUPERHOST</p>
            ) : (
              ""
            )}
          </div>
        </section>
        <section className={styles.sec_two}>
          <img src={detail.picture_url} alt="" />
        </section>
        <section className={styles.sec_three}>
          <div className={styles.sec_three_info}>
            <h3>{`${detail.property_type} hosted by ${detail.host_name}`}</h3>
            <p>
              {`${detail.accommodates} guest · ${detail.bedrooms} bedroom · ${detail.beds} bed · ${detail.bathrooms} bathroom`}
            </p>
          </div>
          <img src={detail.host_picture_url} alt="" />
        </section>
        <section className={styles.sec_four}>
          <p>{`$${detail.price} / night`}</p>
          <Button
            className={styles.book__button}
            onClick={() => {
              window.open(detail.listing_url, "_blank");
            }}
          >
            Book on AirBnB.com
          </Button>
        </section>
        <section className={styles.sec_five}>
          <h3>Description</h3>
          <p>{description}</p>
        </section>
        <section className={styles.sec_six}>
          <h2>Attractions Nearby</h2>
          <div className={styles.atractions}>
            <RecommendCard
              src={"/museum.jpg"}
              title={"Museum Nearby"}
              description={museumList}
              clickable={false}
            />
            <RecommendCard
              src={"/art_gallary.jpg"}
              title={"Art Gallary Nearby"}
              description={artGallaryList}
              clickable={false}
            />
            <RecommendCard
              src={"/park.jpg"}
              title={"Park Nearby"}
              description={parkList}
            />
          </div>
        </section>
        <section className={styles.sec_seven}>
          <h2>Similar Listings</h2>
          <div className={styles.sim_list}>
            {simList.map((li) => {
              let description = li.description;
              if (description.length > 200) {
                description = description.substring(0, 200) + "...";
              }

              return (
                <RecommendCard
                  key={li.listing_id}
                  id={li.listing_id}
                  src={li.picture_url}
                  title={li.name}
                  description={description}
                  price={`$${li.price} / night`}
                  clickfrom={"listing_detail"}
                />
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageNavbar />
      {content}
    </div>
  );
}

export default ListingDetail;

// ListingDetail is the component that shows all details of a listing
// it can be accessed via search result, favorite, or recommended listings
// import React from 'react';

// export default class ListingDetail extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       listing_id: this.props.listing_id,
//       listing_url: this.props.listing_url,
//       name: this.props.name,
//       description: this.props.description,
//       picture_url: this.props.picture_url,
//       price: this.props.price,
//       neighborhood: this.props.neighborhood,
//       neighborhood_overview: this.props.neighborhood_overview,
//       property_type: this.props.property_type,
//       room_type: this.props.room_type,
//       accommodates: this.props.accommodates,
//       bathrooms: this.props.bathrooms,
//       bedrooms: this.props.bedrooms,
//       beds: this.props.beds,
//       number_of_reviews: this.props.number_of_reviews,
//       review_scores_rating: this.props.review_scores_rating,
//       review_score_accuracy: this.props.review_score_accuracy,
//       review_scores_cleanliness: this.props.review_scores_cleanliness,
//       review_scores_checkin: this.props.review_scores_checkin,
//       review_scores_communication: this.props.review_scores_communication,
//       review_scores_location: this.props.review_scores_location,
//       review_scores_value: this.props.review_scores_value,
//       instant_bookable: this.props.instant_bookable,
//       host_name: this.props.host_name,
//       host_since: this.props.host_since,
//       host_picture_url: this.props.host_picture_url,
//       host_is_superhost: this.props.host_is_superhost,
//       crime_points: this.props.crime_points,
//       crime_level: this.props.crime_level,
//       link: `/listings/${this.props.listing_id}/`
//     };
//   }

//   render() {
//     const href_link = `/listings/{this.state.listing_id}`;
//     return (
//       <div className="card">
//         <div className="card-body">
//           <h5 className="card-title">{this.state.name}</h5>
//           <h6 className="card-subtitle mb-2 text-muted">{this.state.price}/night</h6>
//           <a href={this.state.link} className="card-link">View</a>
//         </div>
//       </div>
//     );
//   }
// };

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function ListingDetails() {
//     let { id } = useParams();
//     let navigate = useNavigate();

//     const [listingDetails, setListingDetails] = useState({});

//     useEffect(() => {
//         axios.get(`http://localhost:8081/listingDetail/${id}`).then((response) => {
//             setListingDetails(response.data[0]);
//         });
//     });

//     return (
//         <div className="loginContainer">
//             {JSON.stringify(listingDetails)}
//             {/* <div className="title"> {listingDetails.listing_id} </div>
//             <div className="body">{listingDetails.description}</div> */}
//             <button onClick={() => {navigate(`/`);}}> Back </button>
//         </div>
//     );
// }

// export default ListingDetails;
