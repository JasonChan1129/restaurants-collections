# My Restaurant Collections

A website built with Node.js and Express that allows users to look up for information of their favourite restaurants.

![project cover](/public/images/cover.png)

![demo](/public/images/demo.gif)

## Prerequisites

-  Node.js
-  Register an account for [MongoDB Altas](https://www.mongodb.com/atlas/database)
-  Register an account for [Google Maps Platform](https://developers.google.com/maps) (for autofill function in creating new restaurant, skip it if you want)
-  Enable Maps Javascript API and Places API on [Google Maps Platform](https://developers.google.com/maps)

-  Create two API keys on [Google Maps Platform](https://developers.google.com/maps) (one key will be exposed in main.handlebars (client side) so make sure to set up application restrictions on the platform, another key will be used in app.js (server side) and inserted as environment variable)

## Installation and execution

#### \* skip step 6 and 7 if you do not wish to enable autofill function in creating new restaurant

1. Clone this project with your terminal

```
git clone https://github.com/JasonChan1129/restaurants-collections.git
```

2. Install all the required dependencies

```
npm install
```

3. Install nodemon if you don't already have

```
npm i nodemon
```

4. Create a .env file for storing environment variables

5. Copy the connection string from [MongoDB Altas](https://www.mongodb.com/atlas/database) and place it in .env file

```
MONGODB_URI=<your connection string>
```

6. Copy an API key from [Google Maps Platform](https://developers.google.com/maps) and place it in .env file

```
GOOGLE_API_KEY=<API key>
```

7. Place your API key (the one with application restrictions) in the script tag in main.handlebars

```
<script src='https://maps.googleapis.com/maps/api/js?key=<API key>&libraries=places&language=en'></script>
```

8. Run the seed data

```
npm run seed
```

9. Start the server

```
npm run dev
```

10. Server runs successfully if the following message is printed.

```
Server is listening to localhost: 3000
```

## Features

-  display a list of restaurants on the main page

-  by clicking the restaurant, users are able to check for more details of it

-  users can search for restaurants based on names and categories

-  users can create a new restaurants data

-  users can edit the details of a restaurant

-  users can delete a restaurants data

-  by leveraging the Google Places API, restaurant's details can be autofilled when users want to create a new restaurant data

## Development tools

-  bootstrap @ 4.3.1
-  dotenv @ 16.0.0
-  express @ 4.17.3
-  express-handlebars @ 3.0.0
-  font-awesome @ 5.8.1
-  @googlemaps/google-maps-services-js @ 3.3.12
-  method-override @ 3.0.0
-  mongoose @ 5.9.7
-  node.js @ 16.14.2
