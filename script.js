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
  $('#js-error-message').empty().removeClass('backdrop');
  $('#js-similar-result-list').empty().removeClass('backdrop');
  $('#js-switch-type').empty().removeClass('backdrop');
  $('#results-list').empty();
  $('#similar-venues').empty();
  $('#more-venues').addClass('hidden').removeClass('backdrop');
  $('#restaurant-location').empty();
  $('#restaurant-map').addClass('hidden').removeClass('backdrop');
  for (let i = 0; i < responseJson.response.venues.length; i++) {
    $('#results-list').append(
      `<li><button class="restaurantChoice" id="restSelect" "type="submit" data-id="${responseJson.response.venues[i].id}" data-filter="${responseJson.response.venues[i].location.address},${responseJson.response.venues[i].location.city}+${responseJson.response.venues[i].location.state}" data-name="${responseJson.response.venues[i].name} "><p id="resChoice">${responseJson.response.venues[i].name}</p>
      <p class="address">${responseJson.response.venues[i].location.address}, ${responseJson.response.venues[i].location.city}, ${responseJson.response.venues[i].location.state}</p>
      <p class="categories">${responseJson.response.venues[i].categories[0].name}</p>
      </button></li>
    `)
  };
  $('#results').removeClass('hidden').addClass('backdrop');
};

//function for when user selects restaurant to pull up map and similar venues
function watchSection() {
  $('section').on('click', '.restaurantChoice', function (event) {
    event.preventDefault(findIdURL, mapURL);
    $('#results').removeClass('backdrop');
    const venueId = $(this).attr('data-id');
    const venueAddress = $(this).attr('data-filter');
    const venueName = $(this).attr('data-name');
    const secondURL = findIdURL.replace('{restaurantId}', venueId);
    const newMapURL = mapURL.replace('{restaurantAddress}', venueAddress);
    getVenueInfo(venueId, secondURL);
    let updatedMapURL = newMapURL.replace(/ /g, '+');
    getRestaurantLocationMap(updatedMapURL, venueName);
  });
};

//function to show similar venues based on restaurant chosen
function getSimilarVenues(responseJson) {
  $('#js-similar-result-list').empty().removeClass('backdrop');
  $('#js-switch-type').empty().removeClass('backdrop');
  $('#results').addClass('hidden')
  for (let i = 0; i < responseJson.response.similarVenues.items.length; i++) {
    $('#similar-venues').append(
      `<li><button class="similarVenueChoice" type="submit" data-id="${responseJson.response.similarVenues.items[i].location.address},${responseJson.response.similarVenues.items[i].location.city}+${responseJson.response.similarVenues.items[i].location.state}" data-name="${responseJson.response.similarVenues.items[i].name}"><p id="simVenChoice">${responseJson.response.similarVenues.items[i].name}</p>
       <p class="address">${responseJson.response.similarVenues.items[i].location.address}, ${responseJson.response.similarVenues.items[i].location.city}, ${responseJson.response.similarVenues.items[i].location.state}</p>
       <p class="categories">${responseJson.response.similarVenues.items[i].categories[0].name}</p></button></li>
      `)
  };
  $('#more-venues').removeClass('hidden').addClass('backdrop');
};

//function to watch for click on similar venue to pull up similar restaurant venue map
function watchSimilarResults() {
  $('section').on('click', '.similarVenueChoice', function (event) {
    event.preventDefault();
    const similarVenueAddress = $(this).attr('data-id');
    const similarVenueName = $(this).attr('data-name');
    const anotherMapURL = mapURL.replace('{restaurantAddress}', similarVenueAddress);
    let similarMapURL = anotherMapURL.replace(/ /g, '+');
    getSimilarRestaurantLocationMap(similarMapURL, similarVenueName);
  });
};


//function to add google map of location of selected restaurant
function getRestaurantLocationMap(updatedMapURL, venueName) {
  $('#restaurant-name').text("").text(venueName + ` Location:`);
  $('#restaurant-location').append(
    `<iframe width="280" height="250" frameborder="0" style="border:0" src=${updatedMapURL}" allowfullscreen>;
        </iframe>`
  );
  $('#restaurant-map').removeClass('hidden').addClass('backdrop');
};


//function to add google map of selected similar restaurant venue
function getSimilarRestaurantLocationMap(similarMapURL, similarVenueName) {
  $('#restaurant-location').empty();
  $('#restaurant-map').addClass('hidden').removeClass('backdrop');
  $('#restaurant-name').text("").text(similarVenueName + ` Location:`);
  $('#restaurant-location').append(
    `<iframe width="280" height="250" frameborder="0" style="border:0" src=${similarMapURL}" allowfullscreen>;
      </iframe>`
  );
  $('#restaurant-map').removeClass('hidden').addClass('backdrop');
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

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      console.log(response);
      $('#js-error-message').empty().addClass('backdrop');
      throw new Error ('There was an error getting your results. Please make sure it was a valid city or try again later.');
    })
    .then(responseJson => {
      if (responseJson.response.venues.length > 1) {
        displayResults(responseJson);
      } else {
        $('#js-similar-result-list').empty().removeClass('backdrop');
        $('#results').addClass('hidden').removeClass('backdrop');
        $('#similar-venues').empty();
        $('#more-venues').addClass('hidden').removeClass('backdrop');
        $('#restaurant-location').empty();
        $('#restaurant-map').addClass('hidden').removeClass('backdrop');
        $('#js-error-message').empty().removeClass('backdrop');
        $('#js-switch-type').addClass('backdrop').text(`Currently there are no restuarants in that category avaialble, please select another Restaurant Type.`);
      }
    })
    .catch(err => {
      $('#js-similar-result-list').empty().removeClass('backdrop');
      $('#results').addClass('hidden').removeClass('backdrop');
      $('#similar-venues').empty();
      $('#more-venues').addClass('hidden').removeClass('backdrop');
      $('#restaurant-location').empty();
      $('#restaurant-map').addClass('hidden').removeClass('backdrop');
      $('#js-switch-type').empty().removeClass('backdrop');
      $('#js-error-message').text(`Something went wrong: ${err.message}`).addClass('backdrop');
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

  fetch(newUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if (responseJson.response.similarVenues.items.length > 1) {
        getSimilarVenues(responseJson);
      } else {
        $('#results').addClass('hidden').removeClass('backdrop');
        $('#similar-venues').empty();
        $('#js-error-message').empty().removeClass('backdrop');
        $('#more-venues').addClass('hidden').removeClass('backdrop');
        $('#js-similar-result-list').addClass('backdrop').text(`Currently there are no similar restuarants in the selected city.`);
      }

    })
    .catch(err => {
      $('#js-similar-result-list').empty().removeClass('backdrop');
      $('#results').addClass('hidden').removeClass('backdrop');
      $('#similar-venues').empty();
      $('#more-venues').addClass('hidden').removeClass('backdrop');
      $('#restaurant-location').empty();
      $('#restaurant-map').addClass('hidden').removeClass('backdrop');
      $('#js-switch-type').empty().removeClass('backdrop');
      $('#js-error-message').text(`Please check your connection: ${err.message}`);
    })
};


//function for intial submit 
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const citySearch = $('#js-city-search').val();
    const limit = $('#js-limit').val();
    const foodType = $('#js-category-food').val();
    getRestaurantList(citySearch, limit, foodType);
  });
}


//slider
var slider = document.getElementById("js-limit");
var output = document.getElementById("limit-slider");
output.innerHTML = slider.value;

slider.oninput = function () {
  output.innerHTML = this.value;
};


$(watchForm);
$(watchSection);
$(watchSimilarResults);