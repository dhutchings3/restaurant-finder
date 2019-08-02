
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
  $('#similar-venues').empty();
  $('#more-venues').addClass('hidden');
  $('#more-venues').removeClass('backdrop');
  $('#restaurant-location').empty();
  $('#restaurant-map').addClass('hidden');
  $('#restaurant-map').removeClass('backdrop');
  for (let i = 0; i < responseJson.response.venues.length; i++){
    $('#results-list').append(
     `<li><button type="submit" class="restaurantChoice" id="resChoice "data-id="${responseJson.response.venues[i].id}" data-filter="${responseJson.response.venues[i].location.address},${responseJson.response.venues[i].location.city}+${responseJson.response.venues[i].location.state}" data-name="${responseJson.response.venues[i].name} ">${responseJson.response.venues[i].name}</button>
      <p>${responseJson.response.venues[i].location.address}</p>
      <p>${responseJson.response.venues[i].categories[0].name}</p>
      </li>
    `)};
  $('#results').removeClass('hidden');
  $('#results').addClass('backdrop');
};

//function for restaurant selected to pull up directions and similar venues
function watchSection() {
    $('section').on('click','.restaurantChoice', function (event) {
      event.preventDefault(findIdURL, mapURL);
      $('#results').removeClass('backdrop');
      const venueId = $(this).attr('data-id');
      const venueAddress = $(this).attr('data-filter');
      const venueName = $(this).attr('data-name');
      console.log(venueId);
      console.log(venueAddress);
      console.log(venueName);
      const secondURL = findIdURL.replace('{restaurantId}', venueId);
      const newMapURL = mapURL.replace('{restaurantAddress}', venueAddress);
      console.log(secondURL);
      getVenueInfo(venueId, secondURL);
     let updatedMapURL = newMapURL.replace(/ /g,'+');
     console.log(updatedMapURL);
    getRestaurantLocationMap(updatedMapURL, venueName);
    });
};

//function to show similar venues based on restaurant chosen
function getSimilarVenues(responseJson) {
    console.log(responseJson);
    $('#results').addClass('hidden')
    for (let i = 0; i < responseJson.response.similarVenues.items.length; i++){
    $('#similar-venues').append(
       `<li><button class="similarVenueChoice" id="simVenChoice" data-id="${responseJson.response.similarVenues.items[i].location.address},${responseJson.response.similarVenues.items[i].location.city}+${responseJson.response.similarVenues.items[i].location.state}" data-name="${responseJson.response.similarVenues.items[i].name}">${responseJson.response.similarVenues.items[i].name}</button>
       <p>${responseJson.response.similarVenues.items[i].location.address}</p>
       <p>${responseJson.response.similarVenues.items[i].categories[0].name}</p></li>
      `)};
    $('#more-venues').removeClass('hidden');
    $('#more-venues').addClass('backdrop');
};

//function for similar results directions
function watchSimilarResults() {
    $('section').on('click','.similarVenueChoice', function (event) {
      event.preventDefault();
      const similarVenueAddress = $(this).attr('data-id');
      const similarVenueName = $(this).attr('data-name');
      console.log(similarVenueAddress);
      console.log(similarVenueName);
      const anotherMapURL = mapURL.replace('{restaurantAddress}', similarVenueAddress);
     let similarMapURL = anotherMapURL.replace(/ /g,'+');
     console.log(similarMapURL);
    getSimilarRestaurantLocationMap(similarMapURL, similarVenueName);
    });
};



//function to add google map with location of restaurant clicked
function getRestaurantLocationMap(updatedMapURL, venueName) {
    $('#restaurant-name').text("");
    $('#restaurant-name').text(venueName + ` Location:`);
    $('#restaurant-location').append(
        `<iframe width="400" height="250" frameborder="0" style="border:0" src=${updatedMapURL}" allowfullscreen>;
        </iframe>`
    );
    $('#restaurant-map').removeClass('hidden');
    $('#restaurant-map').addClass('backdrop');
};


//function to add google map with similar venue location clicked
function getSimilarRestaurantLocationMap(similarMapURL, similarVenueName) {
    $('#restaurant-location').empty();
    $('#restaurant-map').addClass('hidden');
    $('#restaurant-map').removeClass('backdrop');
    $('#restaurant-name').text("");
    $('#restaurant-name').text(similarVenueName + ` Location:`);
    $('#restaurant-location').append(
      `<iframe width="400" height="250" frameborder="0" style="border:0" src=${similarMapURL}" allowfullscreen>;
      </iframe>`
    );
   $('#restaurant-map').removeClass('hidden');
   $('#restaurant-map').addClass('backdrop');
};


//function to pull restaurants based off of city input
function getRestaurantList(query, limit, foodType) {
  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    near: query,
    v: 20180323,
    limit: limit,
    intent: 'browse',
    categoryId: foodType,
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
    const foodType = $('#js-category-food').val();
    console.log(foodType);
    getRestaurantList(citySearch, limit, foodType);
  });
}


//slider javascript
var slider = document.getElementById("js-limit");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
};


$(watchForm);
$(watchSection);
$(watchSimilarResults);
