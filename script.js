
'use strict';

const CLIENT_ID = '4P45WGM4XDI5K2JV3GRR5TPI524HID1BJ0ESK5LESQN4WIHY'; 
const CLIENT_SECRET = 'KY3REMBAJCVJWTJSQRP5OZB51FOKTUNOG2AS5CCAQ3T4MSM2';
const restaurantURL = 'https://api.foursquare.com/v2/venues/search';
const findIdURL = 'https://api.foursquare.com/v2/venues/{restaurantId}/similar';
const mapURL = 'https://www.google.com/maps/embed/v1/search?key=AIzaSyDAbBrbxCR1_a-0KNJ6VaSRxjq_5OytLPs&q={restaurantAddress}';


//function to add query parameters to end of url
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

//function to display restaurant results from user input
function displayResults(responseJson) {
  console.log(responseJson);
  $('#js-switch-type').empty();
  $('#js-switch-type').removeClass('backdrop');
  $('#results-list').empty();
  $('#similar-venues').empty();
  $('#more-venues').addClass('hidden');
  $('#more-venues').removeClass('backdrop');
  $('#restaurant-location').empty();
  $('#restaurant-map').addClass('hidden');
  $('#restaurant-map').removeClass('backdrop');
  for (let i = 0; i < responseJson.response.venues.length; i++){
    $('#results-list').append(
     `<li><button class="restaurantChoice" id="restSelect" "type="submit" data-id="${responseJson.response.venues[i].id}" data-filter="${responseJson.response.venues[i].location.address},${responseJson.response.venues[i].location.city}+${responseJson.response.venues[i].location.state}" data-name="${responseJson.response.venues[i].name} "><p id="resChoice">${responseJson.response.venues[i].name}</p>
      <p class="address">${responseJson.response.venues[i].location.formattedAddress}</p>
      <p class="categories">${responseJson.response.venues[i].categories[0].name}</p>
      </button></li>
    `)};
  $('#results').removeClass('hidden');
  $('#results').addClass('backdrop');
};

//function for when user selects restaurant to pull up map and similar venues
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
    $('#js-switch-type').empty();
    $('#js-switch-type').removeClass('backdrop');
    $('#results').addClass('hidden')
    for (let i = 0; i < responseJson.response.similarVenues.items.length; i++){
    $('#similar-venues').append(
       `<li><button class="similarVenueChoice" type="submit" data-id="${responseJson.response.similarVenues.items[i].location.address},${responseJson.response.similarVenues.items[i].location.city}+${responseJson.response.similarVenues.items[i].location.state}" data-name="${responseJson.response.similarVenues.items[i].name}"><p id="simVenChoice">${responseJson.response.similarVenues.items[i].name}</p>
       <p class="address">${responseJson.response.similarVenues.items[i].location.formattedAddress}</p>
       <p class="categories">${responseJson.response.similarVenues.items[i].categories[0].name}</p></button></li>
      `)};
    $('#more-venues').removeClass('hidden');
    $('#more-venues').addClass('backdrop');
};

//function to watch for click on similar venue to pull up similar restaurant venue map
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



//function to add google map of location of selected restaurant
function getRestaurantLocationMap(updatedMapURL, venueName) {
    $('#restaurant-name').text("");
    $('#restaurant-name').text(venueName + ` Location:`);
    $('#restaurant-location').append(
        `<iframe width="280" height="250" frameborder="0" style="border:0" src=${updatedMapURL}" allowfullscreen>;
        </iframe>`
    );
    $('#restaurant-map').removeClass('hidden');
    $('#restaurant-map').addClass('backdrop');
};


//function to add google map of selected similar restaurant venue
function getSimilarRestaurantLocationMap(similarMapURL, similarVenueName) {
    $('#restaurant-location').empty();
    $('#restaurant-map').addClass('hidden');
    $('#restaurant-map').removeClass('backdrop');
    $('#restaurant-name').text("");
    $('#restaurant-name').text(similarVenueName + ` Location:`);
    $('#restaurant-location').append(
      `<iframe width="280" height="250" frameborder="0" style="border:0" src=${similarMapURL}" allowfullscreen>;
      </iframe>`
    );
   $('#restaurant-map').removeClass('hidden');
   $('#restaurant-map').addClass('backdrop');
};


//requesting restaurant data from api
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

  const queryString = formatQueryParams(params)
  const url = restaurantURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
      return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
        if (responseJson.response.venues.length > 1) {
        displayResults(responseJson);
        }
        else {
          $('#results').addClass('hidden');
          $('#results').removeClass('backdrop');
          $('#similar-venues').empty();
          $('#more-venues').addClass('hidden');
          $('#more-venues').removeClass('backdrop');
          $('#restaurant-location').empty();
          $('#restaurant-map').addClass('hidden');
          $('#restaurant-map').removeClass('backdrop');
          $('#js-switch-type').addClass('backdrop');
          $('#js-switch-type').text(`Currently there are no restuarants in that category avaialble, please select another Restaurant Type.`);
        }
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

//requesting similar restaurant data from api
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


//slider
var slider = document.getElementById("js-limit");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
};


$(watchForm);
$(watchSection);
$(watchSimilarResults);
