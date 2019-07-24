'use strict';

const CLIENT_ID = '4P45WGM4XDI5K2JV3GRR5TPI524HID1BJ0ESK5LESQN4WIHY'; 
const CLIENT_SECRET = 'KY3REMBAJCVJWTJSQRP5OZB51FOKTUNOG2AS5CCAQ3T4MSM2';
const searchURL = 'https://api.foursquare.com/v2/venues/search';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.data.length; i++){
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].name}</h3>
      <p>${responseJson.data[i].location}</p>
      </li>
    `)};
  $('#results').removeClass('hidden');
};

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

  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const citySearch = $('#js-city-search').val();
    const limit = $('#js-limit').val();
    getRestaurantList(citySearch, limit);
  });
}

$(watchForm);