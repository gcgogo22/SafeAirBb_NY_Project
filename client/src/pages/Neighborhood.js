import React, { useState, useEffect } from "react";
import PageNavbar from "../components/PageNavbar";
import SummaryCard from "../components/SummaryCard";
import RecommendCard from "../components/RecommendCard";
import styles from "./Neighborhood.module.css";
import {
  getNbList,
  getNeighborhoodSummary,
  getNbrRecommendedList,
} from "../api/ApiCalls";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

function Neighborhood() {
  const [boroughVal, setBoroughVal] = useState("Manhattan");
  const [neighborhoodVal, setNeighborhoodVal] = useState("");
  const [nbList, setNbList] = useState(null); // for neighborhood list
  const [rcList, setRcList] = useState(null); // for recommend list
  const [summary, setSummary] = useState(null); // for summary object
  const [center, setCenter] = useState([40.73061, -73.935242]);
  const [putMarker, setPutMarker] = useState(false);

  useEffect(() => {
    getNbList(boroughVal, setNbList);
  }, [boroughVal]);

  useEffect(() => {
    if (nbList && neighborhoodVal) {
      const nbInfo = nbList.filter((obj) => {
        return obj.neighbourhood === neighborhoodVal;
      });
      setCenter([nbInfo[0].centery, nbInfo[0].centerx]);
      setPutMarker(true);
      getNeighborhoodSummary(boroughVal, neighborhoodVal, setSummary);
      getNbrRecommendedList(neighborhoodVal, setRcList);
    }
  }, [nbList, boroughVal, neighborhoodVal]);

  const boroughSelectHandler = (event) => {
    setBoroughVal(event.target.value);
    setNeighborhoodVal("");
    setPutMarker(false);
  };

  const neighborhoodSelectHandler = (event) => {
    setNeighborhoodVal(event.target.value);
  };

  // if (summary) console.log(summary);

  let neighborhoodSummary = <div></div>;
  if (summary) {
    if (summary.error) {
      neighborhoodSummary = <h2>{summary.error}</h2>;
    } else {
      neighborhoodSummary = (
        <div className={styles.br_summary}>
          <SummaryCard summary={summary} />
        </div>
      );
    }
  }

  let recommendContent = <div></div>;
  if (rcList && rcList.length > 0) {
    // console.log(rcList);
    recommendContent = (
      <section className={styles.recommend}>
        <h1>Recommended Listings</h1>
        <div className={styles.home__section}>
          {rcList.map((li) => {
            let description = li.description;
            if (description && description.length > 200) {
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
                clickfrom={"neighborhood"}
              />
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <div>
      <PageNavbar />
      <section className={styles.summary}>
        <MapContainer
          className={styles.summary_map}
          center={center}
          zoom={10}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {putMarker ? <Marker position={center} /> : ""}
        </MapContainer>
        <div className={styles.map_summary_info}>
          <h1>Please Choose Borough and Neighborhood</h1>
          <form>
            <div>
              <div className={styles.map_selection}>
                <label>Borough: </label>
                <select value={boroughVal} onChange={boroughSelectHandler}>
                  <option value="Manhattan">Manhattan</option>
                  <option value="Brooklyn">Brooklyn</option>
                  <option value="Queens">Queens</option>
                  <option value="Bronx">Bronx</option>
                  <option value="Staten Island">Staten Island</option>
                </select>
              </div>
              <div className={styles.map_selection}>
                <label>Neighborhood: </label>
                <select
                  value={neighborhoodVal}
                  onChange={neighborhoodSelectHandler}
                >
                  {nbList
                    ? nbList.map((li) => {
                        return (
                          <option
                            key={li.neighbourhood}
                            value={li.neighbourhood}
                          >
                            {li.neighbourhood}
                          </option>
                        );
                      })
                    : ""}
                </select>
              </div>
            </div>
          </form>
          {neighborhoodSummary}
        </div>
      </section>
      {recommendContent}
    </div>
  );
}

export default Neighborhood;
