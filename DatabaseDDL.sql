SHOW DATABASES;
CREATE DATABASE AIRBNB_PROJECT;
USE AIRBNB_PROJECT;

#change host_id to varchar type
#reformat host_since to 'yyyy-mm-dd' format to load into mysql format
#extend field length for host_name to fix import error
CREATE TABLE Host
(
    host_id    					 varchar(50),
	host_url    				 varchar(200),
	host_name    				 varchar(200),
	host_since   				 date,
	host_response_time   		 varchar(30),
	host_response_rate    		 DECIMAL(3,2),
	host_acceptance_rate    	 DECIMAL(3,2),
	host_is_superhost   		 varchar(3),
	host_picture_url    		 varchar(400),
	host_listings_count    		 int,
	PRIMARY KEY (host_id)
);


#add id column, set to varchar type
#extend field name to fix import error
#attach closest 5 neighborhoods to museum by fuzzy join on latitude & longitude
CREATE TABLE Museum
(
   id				    varchar(50),
   latitude    		    DECIMAL(7,5),
   longitude    	    DECIMAL(7,5),
   name     		    varchar(200),
   tel  			    varchar(50),
   url  				varchar(200),
   address  			varchar(50),
   city 				varchar(50),
   zip				    int,
   neighbourhood        varchar(50),
   neighbourhood_group  varchar(50),
   minx                 decimal(7,5),
   maxx                 decimal(7,5),
   miny                 decimal(7,5),
   maxy                 decimal(7,5),
   centerx              decimal(7,5),
   centery              decimal(7,5),
   dist_to_center       decimal(9,4),
   distance_rank        int,
   PRIMARY KEY (id, distance_rank)
);

#add id column, set to to varchar type
#extend field name to fix import error
#attach closest 5 neighborhoods to ary gallery by fuzzy join on latitude & longitude
CREATE TABLE Art_Gallery
(
   id				    varchar(50),
   latitude    			DECIMAL(7,5),
   longitude    		DECIMAL(7,5),
   name     			varchar(200),
   tel  				varchar(50),
   url  				varchar(200),
   address  			varchar(50),
   city 				varchar(50),
   zip				    int,
   neighbourhood        varchar(50),
   neighbourhood_group  varchar(50),
   minx                 decimal(7,5),
   maxx                 decimal(7,5),
   miny                 decimal(7,5),
   maxy                 decimal(7,5),
   centerx              decimal(7,5),
   centery              decimal(7,5),
   dist_to_center       decimal(9,4),
   distance_rank        int,
   PRIMARY KEY (id, distance_rank)
);

## gispropnum column not exist in data, set to null in data
## add id column, set to varchar type
## extend field name to fix import error
# attach closest 5 neighborhoods to park by fuzzy join on latitude & longitude
CREATE TABLE Park
(
   id				   varchar(50),
   latitude    		   DECIMAL(7,5),
   longitude    	   DECIMAL(7,5),
   name     		   varchar(200),
   neighbourhood        varchar(50),
   neighbourhood_group  varchar(50),
   minx                 decimal(7,5),
   maxx                 decimal(7,5),
   miny                 decimal(7,5),
   maxy                 decimal(7,5),
   centerx              decimal(7,5),
   centery              decimal(7,5),
   dist_to_center       decimal(9,4),
   distance_rank        int,
   PRIMARY KEY (id, distance_rank)
);

#foreign key host_id creation error, but populated successfully
## extend field name length to fix import error
CREATE TABLE Listing
(
	listing_id    					 varchar(50),
	listing_url    				 	 varchar(200),
	host_id                          varchar(50),
	name    					     varchar(400),
	description    				 	 varchar(5000),
	neighborhood_overview   		 varchar(5000),
	picture_url    					 varchar(200),
	neighbourhood   				 varchar(30),
	neighbourhood_group    			 varchar(30),
	latitude    					 DECIMAL(7,5),
	longitude    					 DECIMAL(7,5),
	property_type   				 varchar(50),
	room_type    					 varchar(20),
	accommodates    				 int,
	bathrooms    					 DECIMAL(3,1),
	bedrooms    					 int,
	beds    					     int,
	price   					 	 int,
	minimum_nights    				 int,
	maximum_nights   				 int,
	availability_365   				 int,
	number_of_reviews    			 int,
	review_scores_rating    		 DECIMAL(3,2),
	review_scores_accuracy   	     DECIMAL(3,2),
	review_scores_cleanliness        DECIMAL(3,2),
	review_scores_checkin   		 DECIMAL(3,2),
	review_scores_communication    	 DECIMAL(3,2),
	review_scores_location   		 DECIMAL(3,2),
	review_scores_value    			 DECIMAL(3,2),
	instant_bookable   				 varchar(20),
	PRIMARY KEY (listing_id)
);

#Change primary key name to arrest_key, varchar type
#reformat date to 'yyyy-mm-dd'
CREATE TABLE Crime
(
	arrest_key  		varchar(50),
	arrest_date			date,
	law_cat_cd			varchar(1),
	arrest_boro			varchar(1),
    arrest_precinct		int,
    latitude    		DECIMAL(7,5),
    longitude    		DECIMAL(7,5),
    neighbourhood        varchar(50),
    neighbourhood_group  varchar(50),
    minx                 decimal(7,5),
    maxx                 decimal(7,5),
    miny                 decimal(7,5),
    maxy                 decimal(7,5),
    centerx              decimal(7,5),
    centery              decimal(7,5),
    dist_to_center       decimal(9,4),
    distance_rank        int,
    PRIMARY KEY (arrest_key, distance_rank)
);

#foreign key listing_id creation error, but populated successfully
CREATE TABLE Review
( 
   listing_id	varchar(50),
   review_id    varchar(100),
   date     	date,
   reviewer_id  varchar(100),
   PRIMARY KEY(review_id)
);

CREATE TABLE Neighbourhood
(
    neighbourhood        varchar(50),
    neighbourhood_group  varchar(50),
    minx                 decimal(7,5),
    maxx                 decimal(7,5),
    miny                 decimal(7,5),
    maxy                 decimal(7,5),
    centerx              decimal(7,5),
    centery              decimal(7,5),
    crime_points         decimal(6,2),
    crime_level          varchar(3),
   PRIMARY KEY(neighbourhood)
);

CREATE TABLE Sim_Listing
(
    listing_id      varchar(50),
    sim_listing_id  varchar(50),
    similarity      decimal(5,4),
    PRIMARY KEY(listing_id, sim_listing_id)
);