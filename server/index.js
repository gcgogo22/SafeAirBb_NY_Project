const bodyParser = require("body-parser");
const express = require("express");
var routes = require("./routes.js");
const cors = require("cors");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* Listing Summary */
app.get("/ListingSummary", routes.searchListingSummary);

app.get("/Recommend", routes.getRecommendedListings);

app.get("/NbrhoodRecommend", routes.getNbrhoodRecommendedListings);

app.get("/Homepage", routes.getBoroughSummary);

app.post("/auth", routes.registration);

app.post("/login", routes.login);

app.post("/validate", routes.validate);

app.get("/profile/:username", routes.getProfiles);

app.get("/listingDetail/:id", routes.getListingDetails);

app.get("/Neighborhood", routes.getNeighbourhoodSummary);

app.get("/NeighborhoodList/:borough", routes.getNeighbourhoodList);

app.get("/search", routes.getSearchResults);

app.listen(8081, () => {
  console.log(`Server listening on PORT 8081`);
});
