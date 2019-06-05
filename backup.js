<script>
$('.testy').on("click", function () {
  console.log("hi testy");
  ajax('18161');
});

// AJAX request to the USDA Report
var ajax = function (NDBOID) {
  var APIKEY = "MTThsOXeyC4yDoAe048samFSx66c0bbwi0HO6m4G";
  var queryURL = "https://cors-anywhere.herokuapp.com/https://api.nal.usda.gov/ndb/V2/reports?ndbno=" + NDBOID + "&format=json&max=5&offset=0&type=b&api_key=" + APIKEY;
  // console.log("ajax queryURL", queryURL);

  console.log("ajax queryURLtest", queryURL);
  var queryURLtest = "https://cors-anywhere.herokuapp.com/https://api.nal.usda.gov/ndb/reports/?ndbno=01009&type=f&format=json&api_key=DEMO_KEY";
  $.ajax({
    url: queryURL,
    method: "GET",
    // dataType: 'json',
    // contentType: "application/json",
    // dataType: "json",
    // success: 
  })
    .then(function (response) {
      console.log("response: ", response);
    });
};

</script>





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










///////////////////////////////////////////////////////


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
<script src="assets/javascript/app.js"></script>

<script>
    
    
    var measureOption = 0;
    var queryResults;
    var NDBOID = 0;

    var nutrientNames = {
        208: "Energy/Calories",
        203: "Protein",
        204: "Total Fat",
        205: "Carbohydrates",
        291: "Fiber",
        269: "Sugar",
        301: "Calcium",
        303: "Iron",
        304: "Magnesium",
        305: "Phosphorus",
        306: "Potassium",
        307: "Sodium",
        309: "Zinc"
    };


    // Read a page's GET URL variables and return them as an associative array.
    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        // console.log("vars", vars);
        return vars;
    };

    var thingToPullForMyPlate = "";
    // AJAX request to the USDA Report
    var nutritionDetailAjax = function (NDBOID) {
        var APIKEY = "MTThsOXeyC4yDoAe048samFSx66c0bbwi0HO6m4G";
        var queryURL = "https://api.nal.usda.gov/ndb/V2/reports?ndbno=" + NDBOID + "&format=json&max=5&offset=0&type=b&api_key=" + APIKEY;
        console.log("nutritionDetailAjax queryURL", queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                queryResults = response;
                thingtoPullForMyPlate = queryResults.foods[0].food;
                displayNutritionResults(queryResults, NDBOID);
            });
    };


    // Display food title and call label function
    var displayNutritionResults = function (queryResults, NDBOID) {
        console.log("lkasdh", queryResults.foods[0].food.desc.name);
        
        var nutritionViewDiv = $('#nutrition-view');
        var nutritionWrapDiv = $('#nutrition-wrap');
        var foodTitleDiv = $('#food-title');
        var foodTitle = $('<h2>');
        foodTitle.text(queryResults.foods[0].food.desc.name);
        foodTitleDiv.append(foodTitle);
        // nutritionViewDiv.empty();
        // nutritionViewDiv.append(foodTitle);
        nutritionWrapDiv.append(nutritionLabelSelector(NDBOID));
        nutritionViewDiv.append(nutritionWrapDiv);
    };
    

    // Build the nutrition label
    var nutritionLabelSelector = function (NDBOID) {
        var label = $('<div class="label">');
        var labelWrapper = $('<div class="label-wrapper clearfix">');
        var mainHeadingDiv = $('<div class="label-header">Nutrition Facts</div>');
        var measuresDiv = $('<div id="measures"><span id="measures-title">Portion Size: </span></div>');
        var measuresSelect = $('<select id="measures-select">');
        var measuresOptions = function () {
            for (var i = 0; i < queryResults.foods[0].food.nutrients[0].measures.length; i++) {
                var option = $('<option>');
                option.attr("value", i);
                option.text(queryResults.foods[0].food.nutrients[0].measures[i].qty + ' ' + queryResults.foods[0].food.nutrients[0].measures[i].label);
                measuresSelect.append(option);
            };
        };
        measuresOptions();
        measuresDiv.append(measuresSelect);
        labelWrapper.append(mainHeadingDiv, measuresDiv, nutrientTable());
        label.append(labelWrapper);
        return label.html();
    };


    // Display the nutrition data
    var nutrientTable = function () {
        // console.log("hi nutrientTable: ");
        var tableWrapper = $('<div>');
        var tableDiv = $('<div id="table-wrapper">');
        var reportWrapTable = $("<table class='report-wrapper'>");
        var simpleResults = queryResults.foods[0].food;
        for (var i = 0; i < simpleResults.nutrients.length; i++) {
            var id = simpleResults.nutrients[i].nutrient_id;
            // console.log("id: ", id);
            if (id in nutrientNames) {
                // console.log("Fix", id); 
                // console.log("nutrientNames ", nutrientNames[simpleResults.nutrients[i].nutrient_id]);    
                var nutrientTitle = nutrientNames[simpleResults.nutrients[i].nutrient_id];
                var value = simpleResults.nutrients[i].measures[measureOption];
                var nutrientRow = $('<tr>');
                nutrientRow.html("<td class='data-heading-col'>" + nutrientTitle + ":</td>" +
                    "<td class='data-col'>" + value.value + ' ' + value.eunit + "</td></tr>");
                reportWrapTable.append(nutrientRow);
                tableDiv.append(reportWrapTable);
                tableWrapper.append(tableDiv);
            }
        };
        return tableWrapper.html();
    };


    // Change nutrient data by portions from API data
    $(document.body).on("change", "#measures-select", function (e) {
        var option = $("#measures-select option:selected");
        var measuresOptionSelectedValue = $("#measures-select option:selected").val();
        console.log("hi", measuresOptionSelectedValue);
        $("option").removeAttr('selected');
        option.attr("selected", "selected");
        // $("#measures-select").val(measuresOptionSelectedValue);
        measureOption = measuresOptionSelectedValue;
        refreshNutrientTable(NDBOID);
    });


    // Refresh nutrient values from portion drop-down
    var refreshNutrientTable = function (NDBOID) {
        console.log("refresh");
        $('#table-wrapper').empty();
        $('#table-wrapper').append(nutrientTable());
        measureOption = 0;
    };


    // This function builds the detail view page
    var buildNutritionView = function () {
        NDBOID = getUrlVars()["NDBOID"];
        var foodImgUrl = getUrlVars()["foodImgUrl"];        
        var foodPath = decodeURIComponent(foodImgUrl);
        // titleDiv.append(NDBOID);
        console.log("foodImgUrl", foodPath);
        $('#food-photo').append('<img class="food-detail-image" src="' + foodPath + '" />');
        nutritionDetailAjax(NDBOID);
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
    buildNutritionView();
    var data = [
        {
            x: ['Energy/Calories', 'Protein', 'Total Fat', 'Carbohydrates', 'Fiber', 'Sugar'],
            y: [90, 1.1, 0.33, 23.07, 2.6, 12.74],
            type: 'bar'
        }
    ];
    Plotly.newPlot('myDiv', data);
    displayMyPLate("banana");
    
    
</script>

</html>
