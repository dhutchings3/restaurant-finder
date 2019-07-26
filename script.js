'use strict';

const apiKey = 'AIzaSyDAbBrbxCR1_a-0KNJ6VaSRxjq_5OytLPs'

const CLIENT_ID = '4P45WGM4XDI5K2JV3GRR5TPI524HID1BJ0ESK5LESQN4WIHY'; 
const CLIENT_SECRET = 'KY3REMBAJCVJWTJSQRP5OZB51FOKTUNOG2AS5CCAQ3T4MSM2';
const searchURLs = ['https://api.foursquare.com/v2/venues/search', 'https://api.foursquare.com/v2/venues/${responseJson.response.venues[i].categories[0].id}/similar'] 

const STORE = [
    {
        restaurantResults: '${responseJson.response}',
        name: '${responseJson.response.venues[i].name}',
        address: '${responseJson.response.venues[i].location.address}',
        categories: '${responseJson.response.venues[i].categories[0].name}'

    },
]; 

//function to build web friendly query search to add to end of url
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//function to display restaurant resualts
function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.response.venues.length; i++){
    $('#results-list').append(
     `<li><button type="submit" class="restaurantChoice">${responseJson.response.venues[i].name}</button></h3>
      <p>${responseJson.response.venues[i].location.address}</p>
      <p>${responseJson.response.venues[i].categories[0].name}</p>
      </li>
    `)};
  $('#results').removeClass('hidden');
};

//function for restaurant selected to pull up directions and similar venues
function watchSection() {
    $('section').on('click','.restaurantChoice', function (event) {
      event.preventDefault();
      getRestaurantLocationMap();
      getSimilarVenues();
    });
}

//function to show similar venues based on restaurant chosen
function getSimilarVenuse() {
    $('#results').remove()
    $('#other-events').append(
        `<li>${STORE.name}</button></h3>
        <p>${STORE.address}</p>
        <p>${STORE.categories}</p>
        </li>
      `)
    $('#results').removeClass('hidden');
};

//function to add google map with location of user
function getRestaurantLocationMap() {
    return `<iframe width="600" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyDAbBrbxCR1_a-0KNJ6VaSRxjq_5OytLPs&q=Space+Needle,Seattle+WA" allowfullscreen>
    </iframe>`
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
  const url = searchURLs + '?' + queryString;

  console.log(url);

}

//promise function to run mutiple requests
Promise.all(searchURLs.map(url =>
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {displayResults(responseJson)})
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    })
));


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