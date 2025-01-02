# Weather Dashboard For Cities

## Description

This application is called geesaks-weather-dashboard.
Application has an entry box or search box that receives a city name.
Given a city, application will display weather information for today's and next 5-days forecast for this city.
As weather information, whether it is current or 5 days forecast, following information are displayed.

- temperature (in Farenheit),
- wind speed (in Miles per hour),
- humidity (in percent),
- an icon that indicates overall weather like sunny, cloudy, rainy, etc.

Application maintains and shows a list of cities that are previously looked up. This is also called as search history. This feature saves one from typing the city name again. Upon clicking the city that is in history, it bring the weather information as mentioned above. A city that is in the history can be removed by clicking the delete icon on its side.

## Usage

Following is a typical screenshot of the application

![main screenshot](/Develop/assets/images/screenshot01-geesaks-weather-dashboard.jpg)

## Technical Usage

This application's code repository can be downloaded. This application has a client side and a server side.
Client side can be found inside the client folder. Similarly, server side can be found under the server folder.

### Client side

Client side uses Vite library to serve the application on the browser.
Client side code contains an index html, which is the only display content. Then there is a style sheet that contains all the styles for the main application page. Then there is a main typescript file that has all the javascript code to call the server side api-s, to render data on the page, and to respond to user clicks.  
Client side calls the server side using API. Following are the api calls.

- _POST_ **/api/weather/**
  This calls the server side to get weather information for a city.
- _GET_ **/api/weather/history**
  This calls the server side to get all the history. History contains a list of cities that have already been looked up for weather information.
- _DELETE_ **/api/weather/history/${id}**
  This calls the server side to delete an individual history.

### Server side

Server side uses Express library to host and server the API. API contains the following routes. Server stores all the cities that have been looked up previously, in a data store. Search history datastore is maintainted in a JSON file, that is inside the db folder by the name searchHistory.json.

- **/** This serves the index.html page
- **/api/weather/** This is a POST target which sends back weather for a given city.
- **/api/weather/history** This is a GET target which sends back all the cities in the history as a list
- **/api/weather/history/id** This is a DELETE http target that deletes an individual search history

Server side uses the following external APIs to get the weather information.

- **https://openweathermap.org/api/geocoding-api#direct** To get latitude and longitude of a city
- **https://openweathermap.org/forecast5** To get 5 day forecast

To use the above Openweathermap API, an API key is needed. API key will be given for a registration. Base URL of the API, URI routes for the endpoinst, and the key are kept in environment file. Following are the current values:

- **API_BASE_URL**=https://api.openweathermap.org
- **API_KEY**=<Copy Paste the API key here>
- **API_CURRENT_WEATHER_ENDPOINT**=/data/2.5/weather
- **API_5DAYFORECAST_ENDPOINT**=/data/2.5/forecast
- **API_GEOCODE_ENDPOINT**=/geo/1.0/direct
