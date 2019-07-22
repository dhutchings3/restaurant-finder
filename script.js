'use strict';

const apiKey = 'MDilpgURm2aBUVMFTjxWMgR2b_s2opzOwXgtPipcKAGmGgg1-Cc4czG7kH3PhpWfPQ7HTlwiFtaiJgPXEc2fGT-O9FpVYU2nAc0fLp3iOFBYFn6WCojQNcfQOLU1XXYx'; 
const searchURL = 'https://api.yelp.com/v3/businesses/search';


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
      <p>${responseJson.data[i].phone}</p>
      <p>${responseJson.data[i].rating}</p>
      </li>
    `)};
  $('#results').removeClass('hidden');
};

function getRestaurantList(query, limit=10) {
  const params = {
    api_key: apiKey,
    location: [query],
    limit,
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