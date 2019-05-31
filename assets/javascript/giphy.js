$(document).ready(function(){
//Creating variables

let themes = ['lion','Copra','Goat','tiger','camel','monkey','hyena','elephant'];
function renderButtons(){
$("#sportsbutton").empty();
for (i in themes){
let button = `<button type="button" class="sportButtons" value= "${themes[i]}">${themes[i]}</button>`;
$('#sportsbutton').append(button);

}
}
renderButtons();


//Creating buttons
$("#addPlayer").on("click", function(event) {

event.preventDefault();
//Trying to prevent submit button from submitting with prevent default 
let userInput = $("#player-input").val().trim();  
themes.push(userInput);
renderButtons();

});


//Access Giphy API 
$(document).on("click",".sportButtons",function() {

let x = "480w_still";

$("#inner").empty();
let playerName = $(this).val();

let queryURL = $.get("https://api.giphy.com/v1/gifs/search?q=" + playerName + "&api_key=a0DYnx2tlU1LASvc3KFSBrqf6j4ttuJP&limit=3&rating=y");
queryURL.done(function(response) { 
console.log("success got data", response);

let jiffs = response.data

for (i in jiffs){
let gif = `<div style="display: inline-block;"> 
<img class="staticImage img-circle col-md-12"  data-name="${i}" src="${jiffs[i].images[x].url}" alt="${playerName}" style="width:320px; height:210px;">
<h3 class="col-md-offset-3 col-md-3 col-sm-offset-3 col-sm-3 col-xs-offset-3 col-xs-3"><span class="label label-primary">${response.data[i].rating}</span></h3>
<a class="button col-md-offset-3 col-md-3 col-sm-offset-3 col-sm-3 col-xs-offset-3 col-xs-3" href="${jiffs[i].images.original.url}" download="${playerName}.jpg"><span class="glyphicon glyphicon-download-alt"></span></a>
</div>`;
//$('.inner').append("<img src= '" +jiffs[i].images.original.url + "' style='height:200px; width:200px; '/>");
$('#inner').append(gif);
}


$(document).on("click",".staticImage", function(){
let dataNumber = $(this).attr("data-name");
// console.log(response.data[9].images.downsized.url)
$(this).attr("src",response.data[dataNumber].images.downsized.url);
$(this).removeClass("staticImage");
$(this).addClass("animatedImage");
});  

// Add a class to make an image static whenever its clicked 
$(document).on("click",".animatedImage", function(){
let dataNumber = $(this).attr("data-name");
$(this).attr("src",response.data[dataNumber].images[x].url); 
$(this).removeClass("animatedImage");
$(this).addClass("staticImage");
}); 
}
);


});

});
