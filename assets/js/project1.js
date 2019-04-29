//hide widget on page load
$("#dump-safety-here").hide();
$("#dump-outdoor-here").hide();
$(".card-header").hide();
$(".card-body").hide();




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
   
   $(".location").html("<h2>" + response.name + "</h2>");
   $(".wind").text("Wind Speed: " + Math.floor(response.wind.speed)) ;
   $(".tmp-degree").text("Temperature (F) " + Math.floor(response.main.temp) + "º");
   $(".temperature-description").text( response.weather[0].description );

   // Log the data in the console as well
   console.log("Wind Speed: " + response.wind.speed);
   console.log("Humidity: " + response.main.humidity);
   console.log("Temperature: " + response.main.temp);
   console.log("Description" + response.weather[0].description);
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
  //  safetyWidget(citySafety);
   outdoorWidget(cityOutdoors);
  
  $("#destination").val("");
  $("#bg").fadeOut("slow");

  $(".card-header").show();
  $(".card-body").show();

  $(".btn-link").text("YOUR TRIP TO " + city);


//-------------------------------creates a new collapsable card on click-------------------------->

// var accordionDiv = $('<div>').addClass("accordion").attr("id", "accordionExample")
// var cardDiv = $('<div>').addClass("card")
// var cardHeaderDiv = $('<div>').addClass("card-header").attr("id", "headingOne")
// var hDiv = $('<h2>').addClass("mb-0");
// var button =$('<button>').addClass("btn btn-link").attr("type", "button").attr("data-toggle", "collapse").attr("data-target", "#collapseOne").attr("aria-expanded", "true").attr("aria-controls", "collapseOne")

// $(".collapseAll").html(accordionDiv);
// $(".collapseAll").append(cardDiv)  
// $(".collapseAll").append(cardHeaderDiv) 
// $(".collapseAll").append(hDiv) 
// $(".collapseAll").append(button) 

// //---------Collapse Content -------------------------->
// var collapseDiv = $('<div>').addClass("collapse show").attr("id", "collapseOne").attr("aria-labelledby", "headingOne").attr("data-parent", "#accordionExample")
// var cardBodyDiv =$('<div>').addClass("card-body")

// $(".collapse-content").html(collapseDiv);
// $(".collapse-content").append(cardBodyDiv);



});


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
$("a").attr("href", "https://teleport.org/cities/" + cityOutdoors)

//widget url changes via input 
$('iframe').attr("id", "widget")
$("#widget").attr('src', "https://teleport.org/cities/" + cityOutdoors + "/widget/outdoors/?currency=USD")

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
    $("#dump-pic-here").empty();
    var results = response.results;
    for (var i = 0; i < results.length; i++) {
      var imgDiv = $("<div>");
      imgDiv.addClass("imgClass");
      var showImage = $("<img>");
      showImage.attr("src", results[i].urls.thumb);
      showImage.addClass("pic");
      imgDiv.prepend(showImage);

      $("#dump-pic-here").prepend(imgDiv);
    };
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