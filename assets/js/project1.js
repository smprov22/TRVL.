//hide widget on page load
$("#dump-safety-here").hide();
$("#dump-outdoor-here").hide();




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

   weatherApi(city);
   displayUnsplashImages(city);
   $("#destination").val("");
  //  outdoorWidget(city);
 safetyWidget(city);


});
//--------------------------------------SAFETY WIDGET -------------------------------------->

function safetyWidget(city){
//widget link changes via input
$("a").attr("href", "https://teleport.org/cities/" + city)

//widget url changes via input 
$('iframe').attr("id", "widget")
$("#widget").attr('src',"https://teleport.org/cities/" + city + "/widget/crime/?currency=USD")

//display on click 
$("#dump-safety-here").show();

}

//--------------------------------------OUTDOORS WIDGET -------------------------------------->
// function outdoorWidget(city){
// $("a").attr("href", "https://teleport.org/cities/" + city)

// //widget url changes via input 
// $('iframe').attr("id", "widget")
// $("#widget").attr('src', "https://teleport.org/cities/" + city + "/widget/outdoors/?currency=USD")

// //display on click 
// $("#dump-outdoor-here").show();
   
// }
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

