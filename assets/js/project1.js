 //hide widget on page load
 $("#dump-safety-here").hide();
 $("#dump-outdoor-here").hide();
 $("#weather-here").hide();
 $(".tripRow").hide();
 $("#info").hide();
 $("#dotOnLoad").hide();

//--------------------------------------WEATHER API ---------------------------------------->
function weatherApi(city) {
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
   .then(function (response) {

     // Log the queryURL
     console.log(queryURL);

     // Log the resulting object
     console.log(response);

     // Transfer content to HTML
     $(".tmp-degree").text(" Temperature: " + Math.floor(response.main.temp) + "ºF").prepend('<i  class="fas i fa-temperature-high"></i>');
     $(".temperature-description").text(response.weather[0].description);
     $("#weather-here").show();
   });
};




//--------------------------------------onClick event---------------------------------------->
$(document).on("click", "#btn-submit", function (event) {
 event.preventDefault();
 var city = $("#destination").val().trim().split(" ").join("+");
 var cityOutdoors = $("#destination").val().trim().split(" ").join("-");
 var lower = cityOutdoors.toLowerCase();
 var citySolo = $("#destination").val().trim();

 if (city === "") {
   return false;
 }

 database.collection("cities").add({
   city: $("#destination").val().trim(),
   date: new Date()
 });

 weatherApi(city);
 displayUnsplashImages(city);
 outdoorWidget(lower);

 $("#destination").val("");

 // hide jumbotron on click
 $("header").fadeOut("slow");

 var cityTitle = citySolo.toUpperCase();
 $('#tripName').html("YOUR TRIP TO " + cityTitle)
 $("#prevSearch").html("Previous Searches");
 $(".tripRow").show();
 $("#info").show();
 $("#dotOnLoad").show()
});

//-----------deletes card on click---------------->
$(document).on('click', '.delete-button', function (e) {
 e.stopPropagation();
 $(this).closest("tr").remove();
 id = e.target.getAttribute("data-id");
 database.collection("cities").doc(id).delete();
});

//--------------------------------------OUTDOORS WIDGET -------------------------------------->
function outdoorWidget(cityOutdoors) {
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
     showImage.attr("src", results[i].urls.regular + "&w=1100&h=600");
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

function displayCities(doc) {
 var newRow = $("<tr>").addClass("compare-city ").attr("data-id", doc.id).append(
   $("<button>").text(doc.data().city).addClass("btn btn-light  btn-sm m-0"),
   $("<button>").text("x").addClass("delete-button btn btn-light  btn-sm p-1 m-0").attr("data-id", doc.id),
 );
 $("#info").prepend(newRow)
}

database.collection("cities").orderBy("date", "desc").onSnapshot(snapshot => {
 var changes = snapshot.docChanges();
 changes.forEach(change => {
   if (change.type == "added") {
     displayCities(change.doc);
   }
 })
})

//---------------------PREVIOUS SEARCH CLICK-------------------//
$(document).on('click', '.compare-city', function (doc) {
 var cityClick = $(this).attr("data-id");
 console.log(cityClick);
 database.collection("cities").doc(cityClick).get().then(function (doc) {
   if (doc.exists) {
     var reSearch = doc.data().city;
     var outdoors = reSearch.split(" ").join("-");
     var picWeather = reSearch.split(" ").join("+");
     var outdoorsLower = outdoors.toLowerCase();

     weatherApi(picWeather);
     displayUnsplashImages(picWeather);
     outdoorWidget(outdoorsLower);

     var cityTitle = reSearch.toUpperCase();
     $('#tripName').html("YOUR TRIP TO " + cityTitle)
   }
 })
})


