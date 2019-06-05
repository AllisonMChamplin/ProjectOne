$(document).ready(function () {

    // <!-- https://api.nal.usda.gov/ndb/search/?format=json&q=butter&sort=n&max=25&offset=0&api_key=DEMO_KEY -->

    var searchList = [];

    // Click handler for the Search Button
    $("#run-search").on("click", function (event) {
        console.log("clicked search");
        event.preventDefault();
        $('#warn').empty();
        userSearchTerm = $("#search-term").val().trim();
        userSearchTermSpacer = encodeURIComponent(userSearchTerm);
        foodSearchAjax(userSearchTermSpacer);
    });




    // AJAX request to the USDA Search
    var foodSearchAjax = function (input) {

        searchList.push(input);
        console.log("searchList: ", searchList);
        var APIKEY = "MTThsOXeyC4yDoAe048samFSx66c0bbwi0HO6m4G";
        var queryURL = "https://api.nal.usda.gov/ndb/search/?format=json&q=" + input + "&max=5&offset=0" + "&api_key=" + APIKEY;
        console.log("foodSearchAjax queryURL: ", queryURL);
        // AJAX request with the queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                // storing the data from the AJAX request in the results variable
                var results = response;
                console.log("foodSearchAjax results:", results);
                displayFoodSearchResults(results);

            });
    };

    var displayFoodSearchResults = function (x) {

        var displayDiv = $('#food-search-results');
        displayDiv.empty();
        var resultsInfo = $('<div>');
        resultsInfo.attr("id", "results-div");
        resultsInfo.html("<span>Results 1 - 5</span>");
        displayDiv.append(resultsInfo);

        for (var i = 0; i < x.list.item.length; i++) {
            var foodName = x.list.item[i].name;
            var foodId = x.list.item[i].ndbno;
            var button = $('<button class="search-wrapper">');
            button.text(foodName);
            button.attr("value", foodId);
            var buttonParentDiv = $("<div>");
            buttonParentDiv.attr("data-id", foodId);
            buttonParentDiv.append(button);
            displayDiv.append(buttonParentDiv);
        }

    };
    var displayMyPLate = function (input) {
        var APIKEY = "MTThsOXeyC4yDoAe048samFSx66c0bbwi0HO6m4G";
        var queryURL = "https://api.nal.usda.gov/ndb/search/?format=json&q=" + input + "&max=100&offset=0" + "&api_key=" + APIKEY;

        // AJAX request with the queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                // storing the data from the AJAX request in the results variable
                var results = response;
                var i = 0;
                var foodGroup = results.list.item[i].group;
                foodGroup = foodGroup.toLowerCase();
                do{
                    i++;
                    foodGroup = results.list.item[i].group;
                    foodGroup = foodGroup.toLowerCase();
                    console.log(foodGroup);
                   

                }while(foodGroup === "branded food products database");
                
                
                console.log(foodGroup);
                console.log(results);
                //fruits
                if (foodGroup === "fruits and fruit juices" || foodGroup === "legumes and legume products") {
                    $('#myPlateImage').append('<img id="plateThing"src="./assets/images/MP_FRUITS.png" />');
                }
                //grains
                else if (foodGroup === "breakfast cereal" || foodGroup === "cereal grains and pasta" || foodGroup === "nut and seed products" || foodGroup === "baked products") {
                    $('#myPlateImage').append('<img id="plateThing"src="./assets/images/MP_GRAINS.png" />');
                }
                //vegetables
                else if (foodGroup === "vegetables and vegetable products") {
                    $('#myPlateImage').append('<img id="plateThing"src="./assets/images/MP_VEGETABLES.png" />');
                }
                //protein 
                else if (foodGroup === "finfish and shellfish products" || foodGroup === "lamb, veal and game products" || foodGroup === "pork products" || foodGroup === "poultry products" || foodGroup === "sausages and luncheon meats" || foodGroup === "beef products") {
                    $('#myPlateImage').append('<img id="plateThing"src="./assets/images/MP_PROTEIN.png" />');
                }
                //dairy
                else if (foodGroup === "dairy and egg products") {
                    $('#myPlateImage').append('<img id="plateThing"src="./assets/images/MP_DAIRY.png" />');
                }
                //junk
                else if (foodGroup == "fast foods" || foodGroup == "fats and oils" || foodGroup == "snacks" || foodGroup == "sweets" || foodGroup == "soups, sauces and gravys" || foodGroup == "alaskan native and native american products" || foodGroup == "beverages" || foodGroup == "spices and herbs") {
                    $('#myPlateImage').append('<img id="plateThing"src="./assets/images/MP_OTHER.png" />');
                }
                else{
                    $('#myPlateImage').append('<img id="plateThing"src="./assets/images/MP_OTHER.png" />');
                }
            });



    };
    $('#food-search-results').on('click', 'button', function (event) {
        console.log("button clicked");
        var buttonParentDiv = $(this).parent();
        var foodNumber = $(this).attr("value");
        foodReportAjax(foodNumber, buttonParentDiv);
    });



    // AJAX request to the USDA Report
    var foodReportAjax = function (foodNumber, buttonParentDiv) {
        if (!foodNumber) {
            console.log("false");
            return false;
        }
        // https://api.nal.usda.gov/ndb/V2/reports?ndbno=01009&ndbno=01009&ndbno=45202763&ndbno=35193&type=b&format=json&api_key=DEMO_KEY
        var APIKEY = "MTThsOXeyC4yDoAe048samFSx66c0bbwi0HO6m4G";
        var queryURL = "https://api.nal.usda.gov/ndb/V2/reports?ndbno=" + foodNumber + "&format=json&q=" + "&max=5&offset=0" + "&api_key=" + APIKEY;
        console.log("foodReportAjax queryURL: ", queryURL);
        // AJAX request with the queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                // storing the data from the AJAX request in the results variable
                var results = response;
                console.log("foodReportAjax results:", results);
                displayFoodReportResults(results, foodNumber, buttonParentDiv);
            });
    };

    var displayFoodReportResults = function (results, foodNumber, buttonParentDiv) {
        console.log("here");
        // var displayDiv = $('#food-report-results');
        var reportWrapTable = $("<table class='report-wrapper'></table>");
        reportWrapTable.attr("id", foodNumber);

        var foodId = results.foods[0].food.desc.ndbno;
        var foodIdRow = $('<tr>');
        foodIdRow.html("<td class='data-heading-col'>Title:</td>" + "<td class='data-col'>" + foodId + "</td></tr>");
        reportWrapTable.append(foodIdRow);

        var foodName = results.foods[0].food.ing.desc;
        var foodNameRow = $('<tr>');
        foodNameRow.html("<td class='data-heading-col'>Name:</td>" + "<td class='data-col'>" + foodName + "</td></tr></table>");
        reportWrapTable.append(foodNameRow);

        var nutrientsRows = function () {
            console.log("hi loop", results.foods[0].food.nutrients.length);
            console.log("hi name: ", results.foods[0].food.nutrients[0].name);
            var foodGroup = results.foods[0].food.foodGroup;
            for (var i = 0; i < results.foods[0].food.nutrients.length; i++) {
                console.log("loop#: ", i);
                var title = results.foods[0].food.nutrients[i].name;
                var value = results.foods[0].food.nutrients[i].value;

                var nutrientRow = $('<tr>');
                nutrientRow.html("<td class='data-heading-col'>" + title + ":</td>" + "<td class='data-col'>" + value + "</td></tr>");
                reportWrapTable.append(nutrientRow);
            }
        }
        nutrientsRows();
        buttonParentDiv.append(reportWrapTable);

    };



    function displayGifs(input) {
        var anim = input;
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + anim + "&api_key=rozTdp9Yz335rrxK5i05ehFZQ00hDBP0&limit=3&rating=y";
    
        $.ajax({
            url: queryURL,
            method: 'GET'
        })
    
        .done(function(response) {
            
            var results = response.data;


          for (var i = 0; i < results.length; i++) {

 
            var animalDiv = $("<div>");

            var p = $("<p>").text("");


            var animalImage = $("<img>");
     
            animalImage.attr("src", results[i].images.fixed_height_small.url);
                if(i===0){
                    $("#foodGif1").prepend(animalDiv);
                }
                else if(i===1){
                    $("#foodGif2").prepend(animalDiv);
                }
                else if(i===2){
                    $("#foodGif3").prepend(animalDiv);
                }
  
            animalDiv.append(p);
            animalDiv.append(animalImage);

          }
        });
    }




    // Initialize function
    var init = function () {
        console.log("---- hi init ----");
        $('.jumbowrap').show();
        foodSearchAjax();

    };
    // Start the 'app'
   // init();
    //displayMyPLate("banana");
    //displayGifs("banana")

});
