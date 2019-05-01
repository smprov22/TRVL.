//hide widget on page load
$("#dump-safety-here").hide();
$("#dump-outdoor-here").hide();
$("#weather-here").hide();



//--------------------------------------WEATHER API ---------------------------------------->
function weatherApi(city){
var APIKey = "166a433c57516f51dfab1f7edaed8413";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
 "q=" + city + ",Burundi&units=imperial&appid=" + APIKey;

 console.log(queryURL);

// Here we run our AJAX call to the OpenWeatherMap API
$.ajax({
 url: queryURL,
 method: "GET"
})
 // We store all of the retrieved data inside of an object called "response"
 .then(function(response) {

   // Log the queryURL
   console.log(queryURL);

   // Log the resulting object
   console.log(response);

   // Transfer content to HTML

   $(".location").html("<h2>" + response.name + "</h2>").prepend('<i class="fas i fa-globe-americas"></i>');
   $("#CWeather").html(" Currently Weather").prepend('<i class="fas i fa-cloud-sun"></i>') 
   $(".wind").text(" Wind Speed: " + Math.floor(response.wind.speed)).prepend('<i class="fas i fa-wind"></i>') ; 
   $(".tmp-degree").text(" Temperature (F) " + Math.floor(response.main.temp) + "º").prepend('<i  class="fas i fa-temperature-high"></i>'); 
   $(".temperature-description").text( response.weather[0].description );

   // Log the data in the console as well
   console.log(" Wind Speed: " + response.wind.speed);
   console.log(" Humidity: " + response.main.humidity);
   console.log(" Temperature: " + response.main.temp);
   console.log(" Description" + response.weather[0].description);
   $("#weather-here").show();
 });
};




//--------------------------------------onClick event---------------------------------------->
 $(document).on("click", "#btn-submit", function(event){
   event.preventDefault();
   var city = $("#destination").val().trim().split(" ").join("+");
  //  var citySafety = $("#destination").val().trim().split(" ").join("-");
   var cityOutdoors = $("#destination").val().trim().split(" ").join("-");
   
   database.collection("cities").add({
     city: $("#destination").val().trim()
   });

   weatherApi(city);
   displayUnsplashImages(city);
   outdoorWidget(cityOutdoors); 
   addCard(city);
  //safetyWidget(citySafety); (may add back at a later date)
  
  $("#destination").val("");

  // hide jumbotron on click
  $("#bg").fadeOut("slow");

  //----------------------------------------STORES ELEMENTS INSIDE CARD -------------------->
  
  //unsplash photos
  $('.card-body').html($("#dump-pic-here"));

  //outdoor widget
  $('.card-body').append($("#dump-outdoor-here"));

  //weather
  $('.card-body').append($("#weather-here"));
 
});


//------------------------------------------------NEW CARD---------------------------------------->

var i = 1;
var addCard = function(city){
  var cityDisplay = $("#destination").val().trim();
 
  var newCard =$(`<div id="collapse${i}"><div class="accordion" >`
  + '<div class="card"><div class="card-header" id="headingOne"><h2 class="mb-0">' +
  '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'
  + 'YOUR TRIP TO ' + cityDisplay +'</button><button id="delete-button"class="btn" type="button">' + 'X' + '</button>' +
  '</h2></div><div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample"><div class=" row card-body">')
 i++
  $('#collapse').prepend(newCard);
 
  //-----------deletes card on click---------------->
  $('#delete-button').on('click', function(e){
    e.stopPropagation();
    var deleteCard = $(this).closest('.card');
    deleteCard.hide('slow', function(){ deleteCard.remove(); });
  });
 
 }
//--------------------------------------SAFETY WIDGET -------------------------------------->

// function safetyWidget(citySafety){
// //widget link changes via input
// $("a").attr("href", "https://teleport.org/cities/" + citySafety)

// //widget url changes via input 
// $('iframe').attr("id", "widget")
// $("#widget").attr('src',"https://teleport.org/cities/" + citySafety + "/widget/crime/?currency=USD")

// //display on click 
// $("#dump-safety-here").show();

// }

//--------------------------------------OUTDOORS WIDGET -------------------------------------->
function outdoorWidget(cityOutdoors){
  $("a.teleport-widget-link").attr("href", "https://teleport.org/cities/" + cityOutdoors)

//widget url changes via input 
$('iframe').attr("id", "widget")
$("#widget").attr('src', "https://teleport.org/cities/" + cityOutdoors + "/widget/outdoors/?currency=USD&citySwitcher=false")

//display on click 
$("#dump-outdoor-here").show();
   
}
//---------------------------------------------UNSPLASH API------------------------------------------------>
function displayUnsplashImages(city) {
  var queryURL = "https://api.unsplash.com/search/photos?page=1&query=" + city + "&client_id=98fa38e783accee54b2682447c53324d56d7375e2b0e7708a53172528b223ab7";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    $(".carousel-inner").empty();
    var results = response.results;
    for (var i = 0; i < results.length; i++) {
      var imgDiv = $("<div>");
      imgDiv.addClass("carousel-item");
      var showImage = $("<img>");
      showImage.attr("src", results[i].urls.regular +  "&w=1000&h=600");
      showImage.addClass("d-block");
      imgDiv.prepend(showImage);
 
      $(".carousel-inner").append(imgDiv);
    };
    $('.carousel-item').first().addClass('active');
  })
 }

//----------------------------------------FIREBASE----------------------------------->

var config = {
  apiKey: "AIzaSyCa4ZBcq_w_ZNknHJM4ZBKh1bWU8zzlnLU",
  authDomain: "trvl-93a60.firebaseapp.com",
  databaseURL: "https://trvl-93a60.firebaseio.com",
  projectId: "trvl-93a60",
  storageBucket: "trvl-93a60.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.firestore();
var citySearch = $("#previousCities")

function displayCities(doc) {
  var li = $("<li>");
  var cityName = $("<span>");

  $(li).attr("data-id", doc.id);
  $(cityName).text(doc.data().city);

  $(li).append(cityName);

  $(citySearch).append(li);
}

//Getting Data
// database.collection("cities").get().then(function(snapshot) {
//   snapshot.docs.forEach(doc => {
//     displayCities(doc);
//   })
// })
database.collection("cities").onSnapshot(snapshot => {
  var changes = snapshot.docChanges();
  changes.forEach(change => {
    if (change.type == "added") {
      displayCities(change.doc);
    } else if (change.type == "removed") {
      var li = $(citySearch).data("[id=" + change.doc.id + ']');
      citySearch.remove(li);
    }
  })
})
