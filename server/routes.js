var config = require("./db-config.js");
var mysql = require("mysql");
config.connectionLimit = 10;
var connection = mysql.createPool(config);
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const boroughSummaryCache = new Map();

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* ---- Listing Summaries for Listing search results---- */
function searchListingSummary(req, res) {
  const borough = req.query.borough ? req.query.borough : "Manhattan";
  const crime_level = req.query.cr ? req.query.cr : "A";
  const superhost = req.query.sphost ? req.query.sphost : "t";
  const minprice = req.query.minprice ? req.query.minprice : 0;
  const maxprice = req.query.maxprice ? req.query.maxprice : 100000;
  const accommodate = req.query.acmdt ? req.query.acmdt : 0;
  var query = `
    SELECT l.listing_id,
          l.name,
          l.description,
          l.picture_url,
          l.neighbourhood,
          l.neighbourhood_group,
          l.property_type,
          l.review_scores_rating,
          l.price,
          l.accommodates,
          n.crime_level
    FROM Listing l
    left join Neighbourhood n on l.neighbourhood = n.neighbourhood
    left join Host h on l.host_id = h.host_id
    where l.neighbourhood_group = '${borough}'
    and n.crime_level = '${crime_level}'
    and h.host_is_superhost = '${superhost}'
    and l.price between ${minprice} and ${maxprice}
    and l.accommodates >= ${accommodate}
    order by l.review_scores_rating desc, l.accommodates desc, price
    limit 100;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Listing Details ---- */
function getListingDetails(req, res) {
  const lid = req.params.id;
  var query = `
    With museumNearListing AS (
      SELECT n.neighbourhood, m.name AS museum_name, m.tel, m.url, m.address, m.city, m.zip
      FROM Neighbourhood n left join Museum m on n.neighbourhood = m.neighbourhood
    ),
    parkNearListing AS (
        SELECT n.neighbourhood, p.name AS park_name
        FROM Neighbourhood n left join Park p on n.neighbourhood = p.neighbourhood
    ),
    artNearListing AS (
        SELECT n.neighbourhood, ag.name AS art_gallery_name, ag.tel, ag.url, ag.address, ag.city, ag.zip
        FROM Neighbourhood n left join Art_Gallery ag on n.neighbourhood = ag.neighbourhood
    )
    SELECT l.listing_id, listing_url, l.name, description, neighborhood_overview, picture_url,
        l.neighbourhood, l.neighbourhood_group, property_type, room_type, accommodates,
        bathrooms, bedrooms, beds, price, number_of_reviews, review_scores_rating,
        review_scores_accuracy, review_scores_cleanliness, review_scores_checkin,
        review_scores_communication, review_scores_location, review_scores_value,
        instant_bookable, host_name, host_since, host_picture_url, host_is_superhost,
        crime_points, crime_level,
        Count(DISTINCT ml.museum_name) MuseumCount, GROUP_CONCAT(DISTINCT ml.museum_name) MuseumList,
        Count(DISTINCT pl.park_name) ParkCount, GROUP_CONCAT(DISTINCT pl.park_name) ParkList,
        Count(DISTINCT al.art_gallery_name) ArtGalleryCount, GROUP_CONCAT(DISTINCT al.art_gallery_name) ArtGalleryList
    FROM Listing l left join Host h on l.host_id = h.host_id left join
      Neighbourhood n on l.neighbourhood = n.neighbourhood left join
      museumNearListing ml on l.neighbourhood = ml.neighbourhood left join
      parkNearListing pl on l.neighbourhood = pl.neighbourhood left join
      artNearListing al on l.neighbourhood = al.neighbourhood
    WHERE l.listing_id = '${lid}'
    GROUP BY l.listing_id;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Get Recommended Listing ---- */
function getRecommendedListings(req, res) {
  const lid = req.query.listing_id ? req.query.listing_id : 2595;
  var query = `
     SELECT s.sim_listing_id,
            l.name,
            l.description,
            l.picture_url,
            l.listing_id AS listing_id,
            l.price
     FROM Sim_Listing s
     inner join Listing l on s.sim_listing_id = l.listing_id
     WHERE s.listing_id = '${lid}'
     order by s.similarity desc
     limit 6
   `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
}

/* ---- Get Neighborhood Recommended Listing ---- */
function getNbrhoodRecommendedListings(req, res) {
  const neighborhood = req.query.nbrhood;
  var query = `
  SELECT l.listing_id,
    l.name,
    l.neighbourhood_group,
    l.neighbourhood,
    l.description,
    l.picture_url,
    l.review_scores_rating,
    l.price
  FROM Listing l
  left join Host h on l.host_id = h.host_id
  left join Review r on l.listing_id = r.listing_id
  WHERE l.neighbourhood = '${neighborhood}'
  and price <= (select AVG(price) from Listing where neighbourhood = '${neighborhood}')
  and accommodates >= (select AVG(accommodates) from Listing where neighbourhood = '${neighborhood}')
  and l.review_scores_rating >= 4
  and l.review_scores_value >= 4
  and h.host_is_superhost = 't'
  group by l.listing_id,
  l.name,
  l.description,
  l.picture_url,
  l.review_scores_rating,
  l.review_scores_value
  order by l.review_scores_rating desc, l.review_scores_value desc, count(distinct r.review_id) desc
  limit 6
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
}

/* ---- Get Neighbourhood Summary ---- */
function getNeighbourhoodSummary(req, res) {
  const borough = req.query.borough ? req.query.borough : "Queens";
  const neighborhood = req.query.neighborhood
    ? req.query.neighborhood
    : "Hollis";
    var query = `
    WITH neighbourhood_summary AS (
      SELECT N.neighbourhood, COUNT(DISTINCT M.id) AS MuseumCount, N.crime_points
      FROM Neighbourhood N LEFT JOIN Museum M ON N.neighbourhood = M.neighbourhood
      GROUP BY 1
    ),
    parkCount AS (
        SELECT N.neighbourhood, COUNT(DISTINCT P.id) AS ParkCount
        FROM Neighbourhood N LEFT JOIN Park P ON N.neighbourhood = P.neighbourhood
        GROUP BY 1
    ),
    artCount AS (
        SELECT N.neighbourhood, COUNT(DISTINCT AG.id) AS ArtGalleryCount
        FROM Neighbourhood N LEFT JOIN Art_Gallery AG ON N.neighbourhood = AG.neighbourhood
        GROUP BY 1
    )
    SELECT L.neighbourhood, L.neighbourhood_group, AVG(L.price) AS AveragePrice, COUNT(DISTINCT L.listing_id) AS TotalListing,
         MIN(L.price) AS LowestPrice, MAX(L.price) AS HighestPrice,
         AVG(L.review_scores_rating) AS AverageListingRating,
         N.MuseumCount, P.ParkCount, AG.ArtGalleryCount, N.crime_points AS CrimeScore
    FROM Listing L LEFT JOIN neighbourhood_summary N ON L.neighbourhood = N.neighbourhood
      LEFT JOIN artCount AG ON L.neighbourhood = AG.neighbourhood LEFT JOIN parkCount P ON L.neighbourhood = P.neighbourhood
    WHERE L.neighbourhood = '${neighborhood}' AND L.neighbourhood_group = '${borough}'
    GROUP BY 1;
    `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
}

/* ---- Get Neighbourhood Summary ---- */
function getNeighbourhoodList(req, res) {
  var borough = req.params.borough;
  var query = `
  SELECT neighbourhood, centerx, centery
  FROM Neighbourhood
  WHERE neighbourhood_group = "${borough}"
  ORDER BY neighbourhood;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Get Borough Summary ---- */
function getBoroughSummary(req, res) {
  // use cache
  if (boroughSummaryCache.has("boroughSummary")) {
    return res.json(boroughSummaryCache.get("boroughSummary"));
  }

  var query = `
  WITH neighbourhood_summary AS (
    SELECT N.neighbourhood_group, COUNT(DISTINCT M.id) AS MuseumCount, AVG(N.crime_points) AS CrimeScore
    FROM Neighbourhood N LEFT JOIN Museum M ON N.neighbourhood_group = M.neighbourhood_group
    GROUP BY 1
  ),
  parkCount AS (
      SELECT N.neighbourhood_group, COUNT(DISTINCT P.id) AS ParkCount
      FROM Neighbourhood N LEFT JOIN Park P ON N.neighbourhood_group = P.neighbourhood_group
      GROUP BY 1
  ),
  artCount AS (
      SELECT N.neighbourhood_group, COUNT(DISTINCT AG.id) AS ArtGalleryCount
      FROM Neighbourhood N LEFT JOIN Art_Gallery AG ON N.neighbourhood_group = AG.neighbourhood_group
      GROUP BY 1
  )
  SELECT L.neighbourhood_group, COUNT(L.listing_id) AS TotalListing, AVG(L.price) AS AveragePrice,
       AVG(L.review_scores_rating) AS AverageListingRating, N.MuseumCount,
       AG.ArtGalleryCount, P.ParkCount,
       N.CrimeScore
  FROM Listing L LEFT JOIN neighbourhood_summary N ON L.neighbourhood_group = N.neighbourhood_group
      LEFT JOIN artCount AG ON L.neighbourhood_group = AG.neighbourhood_group LEFT JOIN
      parkCount P ON L.neighbourhood_group = P.neighbourhood_group
  GROUP BY 1;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      boroughSummaryCache.set("boroughSummary", rows);
      res.json(rows);
    }
  });
}

/* ---- Get Museums Near Listing ---- */
function getMuseumsNearListing(req, res) {
  var lid = req.query.id;
  var query = `
  SELECT l.listing_id, m.name, m.tel, m.url, m.address, m.city, m.zip
  FROM Listing l left join Museum m on l.neighbourhood = m.neighbourhood
  WHERE l.listing_id = '${lid}';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Get Parks Near Listing ---- */
function getParksNearListing(req, res) {
  var lid = req.query.id;
  var query = `
  SELECT l.listing_id, p.name
  FROM Listing l left join Park p on l.neighbourhood = p.neighbourhood
  WHERE l.listing_id = '${lid}';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Get Art Galleries Near Listing ---- */
function getArtGalleriesNearListing(req, res) {
  var lid = req.query.id;
  var query = `
  SELECT l.listing_id, ag.name, ag.tel, ag.url, ag.address, ag.city, ag.zip
  FROM Listing l left join Art_Gallery ag on l.neighbourhood = ag.neighbourhood
  WHERE l.listing_id = '${lid}';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// ---- Get Search Results ---- //
function getSearchResults(req, res) {
  const borough = req.query.borough;
  const priceMin = req.query.price_min;
  const priceMax = req.query.price_max;
  const crimeRate = req.query.crime_rate;
  const accommodates = req.query.accommodates;
  const isSuperhost = req.query.is_superhost;
  let orderBy = "";
  if (req.query.order_by === "price_low") {
    orderBy = "price";
  } else if (req.query.order_by === "price_high") {
    orderBy = "price DESC";
  } else if (req.query.order_by === "review") {
    orderBy = "review_scores_rating DESC";
  } else if (req.query.order_by === "crime") {
    orderBy = "crime_level";
  }

  // console.log(borough, priceMin, crimeRate, accommodates, isSuperhost);
  // console.log(orderBy);

  var query = `
    SELECT l.listing_id, l.name, picture_url, property_type, accommodates,
      bathrooms, bedrooms, beds, price, review_scores_rating, host_is_superhost, crime_level
    FROM Listing l join Host h on l.host_id = h.host_id
      left join Neighbourhood n on l.neighbourhood = n.neighbourhood
    WHERE l.neighbourhood_group = "${borough}" AND price >= ${priceMin} AND price <= ${priceMax}
      AND crime_level <= "${crimeRate}" AND accommodates >= ${accommodates}
      ${isSuperhost === "true" ? "AND h.host_is_superhost = 't'" : ""}
    ORDER BY ${orderBy}
    LIMIT 50;
   `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Registration ---- */
function registration(req, res) {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    var query = `
    INSERT INTO Users (username, password)
    VALUES ('${username}', '${hash}');
    `;

    connection.query(query, function (err, rows, fields) {
      if (err) {
        console.log(err);
      }
    });
    res.json("SUCCESS");
  });
}

/* ---- Login ---- */
function login(req, res) {
  const { username, password } = req.body;

  var query = `
  SELECT username, password
  FROM Users
  WHERE username = '${username}';
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      if (rows.length == 0) {
        res.json({ error: "User Doesn't Exist" });
      } else {
        bcrypt.compare(password, rows[0].password).then((match) => {
          if (!match) {
            res.json({ error: "Wrong Username And Password Combination" });
          } else {
            console.log("YOU LOGGED IN!!!");
            const accessToken = sign(
              { username: rows[0].username },
              "importantsecret"
            );
            res.json({ token: accessToken, username: username });
          }
        });
      }
    }
  });
}

/* ---- Validate ---- */
function validate(req, res) {
  console.log(req.user);
  res.json(req.user);
}

/* ---- Profiles ---- */
function getProfiles(req, res) {
  const username = req.params.username;
  var query = `
  SELECT username
  FROM Users u
  WHERE u.username = '${username}';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// The exported functions, which can be accessed in index.js.
module.exports = {
  searchListingSummary: searchListingSummary,
  getRecommendedListings: getRecommendedListings,
  getNbrhoodRecommendedListings: getNbrhoodRecommendedListings,
  getNeighbourhoodList: getNeighbourhoodList,
  getBoroughSummary: getBoroughSummary,
  getNeighbourhoodSummary: getNeighbourhoodSummary,
  getListingDetails: getListingDetails,
  getMuseumsNearListing: getMuseumsNearListing,
  getParksNearListing: getParksNearListing,
  getArtGalleriesNearListing: getArtGalleriesNearListing,
  registration: registration,
  login: login,
  getProfiles: getProfiles,
  validate: validate,
  getSearchResults: getSearchResults,
};
