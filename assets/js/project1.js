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
 $("#btn-submit").on("click", function(event){
   event.preventDefault();

   var city = $("#destination").val().trim().split(" ").join("+");
   weatherApi(city);


//--------------------------------------SAFETY WIDGET -------------------------------------->
//widget link changes via input
var newLink = "https://teleport.org/cities/" + city 
$(".teleport-widget-link").attr("href", newLink); 

//widget url changes via input 
var newURL = "https://teleport.org/cities/" + city + "/widget/crime/?currency=USD"
$(".safety-widget-script").attr('data-url', newURL);

//display on click 
$("#dump-safety-here").show();

//--------------------------------------OUTDOORS WIDGET -------------------------------------->

//widget url changes via input 
$(".outdoor-widget-script").attr('data-url', "https://teleport.org/cities/" + city + "/widget/outdoors/?currency=USD")

//display on click 
$("#dump-outdoor-here").show();

 });



//  var widgetLink = $('<a>').addClass("teleport-widget-link").attr("href", "https://teleport.org/cities/" + city)
//  var scriptLink = $( this ).addClass("teleport-widget-script").attr("data-url", "https://teleport.org/cities/" + city + "/widget/crime/?currency=USD").attr("src", "https://teleport.org/assets/firefly/widget-snippet.min.js");

//  $(".teleport-widget-link").html(widgetLink, scriptLink);