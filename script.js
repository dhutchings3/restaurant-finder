'use strict';

const CLIENT_ID = '4P45WGM4XDI5K2JV3GRR5TPI524HID1BJ0ESK5LESQN4WIHY'; 
const CLIENT_SECRET = 'KY3REMBAJCVJWTJSQRP5OZB51FOKTUNOG2AS5CCAQ3T4MSM2';
const restaurantURL = 'https://api.foursquare.com/v2/venues/search';
const findIdURL = 'https://api.foursquare.com/v2/venues/{restaurantId}/similar';
const mapURL = 'https://www.google.com/maps/embed/v1/search?key=AIzaSyDAbBrbxCR1_a-0KNJ6VaSRxjq_5OytLPs&q={restaurantAddress}';


//function to build web friendly query search to add to end of url
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

//function to display restaurant resualts
function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.response.venues.length; i++){
    $('#results-list').append(
     `<li><button type="submit" class="restaurantChoice" data-id="${responseJson.response.venues[i].id}" data-filter="${responseJson.response.venues[i].location.address},${responseJson.response.venues[i].location.city}+${responseJson.response.venues[i].location.state}" >${responseJson.response.venues[i].name}</button>
      <p>${responseJson.response.venues[i].location.address}</p>
      <p>${responseJson.response.venues[i].categories[0].name}</p>
      </li>
    `)};
  $('#results').removeClass('hidden');
};

//function for restaurant selected to pull up directions and similar venues
function watchSection() {
    $('section').on('click','.restaurantChoice', function (event) {
      event.preventDefault(findIdURL, mapURL);
      const venueId = $(this).attr('data-id');
      const venueAddress = $(this).attr('data-filter');
      console.log(venueId);
      console.log(venueAddress);
      const secondURL = findIdURL.replace('{restaurantId}', venueId);
      const newMapURL = mapURL.replace('{restaurantAddress}', venueAddress);
      console.log(secondURL);
      getVenueInfo(venueId, secondURL);
     let updatedMapURL = newMapURL.replace(/ /g,'+');
     console.log(updatedMapURL);
    getRestaurantLocationMap(updatedMapURL);
    location.replace('https://dhutchings3.github.io/restaurant-finder/restaurants');
    });
};


//function to pull restaurants based off of city input
function getRestaurantList(query, limit) {
  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    near: query,
    v: 20180323,
    limit: limit,
    intent: 'browse',
    categoryId: '4d4b7105d754a06374d81259',
  };

  //building url with search query
  const queryString = formatQueryParams(params)
  const url = restaurantURL + '?' + queryString;

  console.log(url);

  //requesting data from api
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
        displayResults(responseJson);
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function getVenueInfo(venueId, secondURL) {
  const venueParams = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    v: 20180323,
    venue_id: venueId,
  };

  const queryString = formatQueryParams(venueParams)
  const newUrl = secondURL + '?' + queryString;

  console.log(newUrl);

    //requesting more data from api
  fetch(newUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
        getSimilarVenues(responseJson);
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}


//function for intial submit 
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const citySearch = $('#js-city-search').val();
    const limit = $('#js-limit').val();
    getRestaurantList(citySearch, limit);
  });
}


$(watchForm);
$(watchSection);