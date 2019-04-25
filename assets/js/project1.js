// alert("hola");

$.ajax({
    url: "https://api.teleport.org/api/",
    method: "GET"
  }).then(function(response) {
    console.log(response);
  });
