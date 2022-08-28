USE AIRBNB_PROJECT;

CREATE INDEX idx_pr
ON Listing (price);

CREATE INDEX idx_nbrgrp
ON Listing (neighbourhood_group);

CREATE INDEX idx_nbr
ON Listing (neighbourhood);

CREATE INDEX idx_lstid
ON Review(listing_id);

"""
get summary of borough
"""
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

"""
get default recommended listings for a neighbourhood
"""
SELECT l.listing_id,
       l.name,
       l.neighbourhood_group,
       l.neighbourhood,
       l.description,
       l.picture_url,
       l.review_scores_rating,
       l.review_scores_value,
       count(distinct r.review_id) as review_count
     FROM Listing l
     -- left join Host h on l.host_id = h.host_id
     left join Review r on l.listing_id = r.listing_id
     WHERE l.neighbourhood = 'Manhattan'
       and price <= (select AVG(price) from Listing where neighbourhood = 'Manhattan')
       and accommodates >= (select AVG(accommodates) from Listing where neighbourhood = 'Manhattan')
       and l.review_scores_rating >= 4
       and l.review_scores_value >= 4
      -- and h.host_is_superhost = 't'
     group by l.listing_id,
             l.name,
             l.description,
             l.picture_url,
             l.review_scores_rating,
             l.review_scores_value
     order by l.review_scores_rating desc, l.review_scores_value desc, count(distinct r.review_id) desc
     limit 10;

"""
get summary statistics of a neighbourhood
"""
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

"""
get listing search result based on user input: crime, price, accomodate, superhost
"""
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
    where l.neighbourhood_group = 'Manhattan'
    and n.crime_level = 'A'
    and h.host_is_superhost = 't'
    and l.price between 0 and 500
    and l.accommodates >= 0
    order by l.review_scores_rating desc, l.accommodates desc, price
    limit 100;

"""
get all relevant details of a listing
"""
ith museumNearListing AS (
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
