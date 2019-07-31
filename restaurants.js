

//function to show similar venues based on restaurant chosen
function getSimilarVenues(responseJson) {
    console.log(responseJson);
    $('#results').addClass('hidden')
    for (let i = 0; i < responseJson.response.similarVenues.items.length; i++){
    $('#similar-venues').append(
       `<li><h3>${responseJson.response.similarVenues.items[i].name}</h3>
       <p>${responseJson.response.similarVenues.items[i].location.address}</p>
       <p>${responseJson.response.similarVenues.items[i].categories[0].name}</p></li>
      `)};
    $('#more-venues').removeClass('hidden');
};

//function to add google map with location of restaurant clicked
function getRestaurantLocationMap(updatedMapURL) {
    console.log('removed');
    $('#restaurant-location').append(
      `<iframe width="600" height="450" frameborder="0" style="border:0" src=${updatedMapURL}" allowfullscreen>;
      </iframe>`
    );
   $('#restaurant-map').removeClass('hidden');
  };