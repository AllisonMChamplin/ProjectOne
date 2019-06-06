$(document).ready(function () {

    var measureOption = 0;
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
        return vars;
    };


    // AJAX request to the USDA Report
    var nutritionDetailAjax = function (NDBOID) {
        var APIKEY = "MTThsOXeyC4yDoAe048samFSx66c0bbwi0HO6m4G";
        var queryURL = "https://cors-anywhere.herokuapp.com/https://api.nal.usda.gov/ndb/V2/reports?ndbno=" + NDBOID + "&format=json&max=5&offset=0&type=b&api_key=" + APIKEY;
        console.log("nutritionDetailAjax queryURL", queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                displayNutritionResults(response);
                nutritionLabelSelector(response);
            });
    };


    // Display food title and call label function
    var displayNutritionResults = function (response) {
        // console.log("bird", response);
        var foodTitleDiv = $('#food-title');
        var foodTitle = $('<h2>');
        foodTitle.text(response.foods[0].food.desc.name);
        foodTitleDiv.append(foodTitle);
    };


    // Build the nutrition label
    var nutritionLabelSelector = function (response) {
        var nutritionLabelDiv = $('#nutrition-wrap');
        var label = $('<div class="label">');
        var labelWrapper = $('<div class="label-wrapper clearfix">');
        var mainHeadingDiv = $('<div class="label-header">Nutrition Facts</div>');
        var measuresDiv = $('<div id="measures"><span id="measures-title">Portion Size: </span></div>');
        var measuresSelect = $('<select id="measures-select">');
        var measuresOptions = function () {
            for (var i = 0; i < response.foods[0].food.nutrients[0].measures.length; i++) {
                var option = $('<option>');
                option.attr("value", i);
                option.text(response.foods[0].food.nutrients[0].measures[i].qty + ' ' + response.foods[0].food.nutrients[0].measures[i].label);
                measuresSelect.append(option);
            };
        };
        measuresOptions();
        measuresDiv.append(measuresSelect);
        labelWrapper.append(mainHeadingDiv, measuresDiv);

        // Display the nutrition data
        var nutrientTable = function () {
            var tableWrapper = $('<div class="tbl">');
            var tableDiv = $('<div id="table-wrapper">');
            var reportWrapTable = $("<table class='report-wrapper'>");
            var simpleResults = response.foods[0].food;
            for (var i = 0; i < simpleResults.nutrients.length; i++) {
                var id = simpleResults.nutrients[i].nutrient_id;
                if (id in nutrientNames) {
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
            labelWrapper.append(tableWrapper);
        };
        nutrientTable();
        plotlyRefresher(response);
        label.append(labelWrapper);
        nutritionLabelDiv.append(label);
    };


    // Change nutrient data by portions from API data
    $(document.body).on("change", "#measures-select", function (e) {
        var option = $("#measures-select option:selected");
        var measuresOptionSelectedValue = $("#measures-select option:selected").val();
        // console.log("hi", measuresOptionSelectedValue);
        $("option").removeAttr('selected');
        option.attr("selected", "selected");
        measureOption = measuresOptionSelectedValue;
        refreshNutrientTableAjax(NDBOID);
    });


    // Refresh nutrient values from portion drop-down
    var refreshNutrientTableAjax = function (NDBOID) {
        console.log("refresh");
        var APIKEY = "MTThsOXeyC4yDoAe048samFSx66c0bbwi0HO6m4G";
        var queryURL = "https://cors-anywhere.herokuapp.com/https://api.nal.usda.gov/ndb/V2/reports?ndbno=" + NDBOID + "&format=json&max=5&offset=0&type=b&api_key=" + APIKEY;
        // console.log("refreshNutrientTableAjax queryURL", queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                $('.tbl').empty();
                nutrientTableRefresher(response);
                plotlyRefresher(response);
            });
    };


    // Refresh the nutrition data table when select box is changed
    var nutrientTableRefresher = function (response) {
        // console.log("hi nutrientTable: ");
        var tableWrapper = $('<div class="tbl">');
        var tableDiv = $('<div id="table-wrapper">');
        var reportWrapTable = $("<table class='report-wrapper'>");
        var simpleResults = response.foods[0].food;
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
        $('.label-wrapper').append(tableWrapper);
    };


    // GIPHY //
    // Ajax call to GiphyAPI
    var gifRequest = function (giphySearchString) {
        var APIKEY = "DPBvGpuy5v0lsWlSAd51dsjMvJ6rjWcP";
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            giphySearchString + "&api_key=" + APIKEY + "&limit=4&rating=g";
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                displayGifs(response.data);
            });
    };


    // Function to add GIPHYAPI ajax results array to the page
    var displayGifs = function (x) {
        var giphyList = x;
        var wrapDiv = $("<div class='wrap clearfix'>");
        for (var i = 0; i < giphyList.length; i++) {
            var gifDiv = $("<div class='topic'>");
            // Creating a paragraph tag with the result item's rating
            var rating = $("<p>").text("Rating: " + giphyList[i].rating.toUpperCase());
            rating.attr("class", "meta");
            var topicImage = $("<img />");
            // Setting the src attribute of the image to the fixed height still property
            topicImage.attr("src", giphyList[i].images.fixed_height_still.url);
            topicImage.attr("data-state", "still");
            topicImage.attr("data-still", giphyList[i].images.fixed_height_still.url);
            topicImage.attr("data-animate", giphyList[i].images.fixed_height.url);
            topicImage.attr("class", "clicky");
            // Appending the paragraph and image tag to the gifDiv
            gifDiv.attr("class", "topic-image");
            gifDiv.append(topicImage);
            gifDiv.append(rating);
            // gifDiv.append(title);
            wrapDiv.append(gifDiv);
        }
        $("#gifs-appear-here").prepend(wrapDiv);
    };


    // Click handler to toggle between still image and animated GIFs
    $('body').on('click', 'img', function () {
        // Store the data state attribute
        var state = $(this).attr("data-state");
        // Toggle the data state on click
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    });
    // END GIPHY //


    // My Plate //
    var displayMyPLate = function (input) {

        var APIKEY = "MTThsOXeyC4yDoAe048samFSx66c0bbwi0HO6m4G";
        var queryURL = "https://cors-anywhere.herokuapp.com/https://api.nal.usda.gov/ndb/V2/reports?ndbno=" + NDBOID + "&format=json&max=1&offset=0" + "&type=f&api_key=" + APIKEY;

        // var APIKEY = "MTThsOXeyC4yDoAe048samFSx66c0bbwi0HO6m4G";
        // var queryURL = "https://cors-anywhere.herokuapp.com/https://api.nal.usda.gov/ndb/search/?format=json&q=" + input + "&max=100&offset=0" + "&api_key=" + APIKEY;
        console.log("myPlate queryURL: ", queryURL);

        // AJAX request with the queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                // storing the data from the AJAX request in the results variable
                var results = response;
                // var i = 0;
                // var foodGroup = results.list.item[i].group;
                // var foodGroup = results.foods[0].food.desc.fg;
                // foodGroup = foodGroup.toLowerCase();
                // do {
                //     i++;
                //     // foodGroup = results.list.item[i].group;
                foodGroup = results.foods[0].food.desc.fg;
                foodGroup = foodGroup.toLowerCase();
                // console.log(foodGroup);

                // } while (foodGroup === "branded food products database");

                console.log(foodGroup);
                console.log(results);
                //fruits
                if (foodGroup === "fruits and fruit juices" || foodGroup === "legumes and legume products") {
                    $('#myPlateImage').append('<img id="plateThing" src="./assets/images/MP_FRUITS.png" />');
                }
                //grains
                else if (foodGroup === "breakfast cereal" || foodGroup === "cereal grains and pasta" || foodGroup === "nut and seed products" || foodGroup === "baked products") {
                    $('#myPlateImage').append('<img id="plateThing" src="./assets/images/MP_GRAINS.png" />');
                }
                //vegetables
                else if (foodGroup === "vegetables and vegetable products") {
                    $('#myPlateImage').append('<img id="plateThing" src="./assets/images/MP_VEGETABLES.png" />');
                }
                //protein 
                else if (foodGroup === "finfish and shellfish products" || foodGroup === "lamb, veal and game products" || foodGroup === "pork products" || foodGroup === "poultry products" || foodGroup === "sausages and luncheon meats" || foodGroup === "beef products") {
                    $('#myPlateImage').append('<img id="plateThing" src="./assets/images/MP_PROTEIN.png" />');
                }
                //dairy
                else if (foodGroup === "dairy and egg products") {
                    $('#myPlateImage').append('<img id="plateThing" src="./assets/images/MP_DAIRY.png" />');
                }
                //junk
                else if (foodGroup == "fast foods" || foodGroup == "fats and oils" || foodGroup == "snacks" || foodGroup == "sweets" || foodGroup == "soups, sauces and gravys" || foodGroup == "alaskan native and native american products" || foodGroup == "beverages" || foodGroup == "spices and herbs") {
                    $('#myPlateImage').append('<img id="plateThing" src="./assets/images/MP_OTHER.png" />');
                }
                else {
                    $('#myPlateImage').append('<img id="plateThing" src="./assets/images/MP_OTHER.png" />');
                }
            });

    };
    // End My Plate //


    // Refresh the Plotly.js bar chart when select box is changed
    var plotlyRefresher = function (response) {
        var simpleResults = response.foods[0].food;
        var xArray = [];
        var yArray = [];
        for (var i = 0; i < simpleResults.nutrients.length; i++) {
            var id = simpleResults.nutrients[i].nutrient_id;
            var value = simpleResults.nutrients[i].measures[measureOption].value;
            // console.log("simpleresults, ", simpleResults);
            if (id in nutrientNames) {
                var nutrientTitle = nutrientNames[simpleResults.nutrients[i].nutrient_id];
                // console.log("simpleResults: ", simpleResults);
                // console.log("value: ", value);
                xArray.push(nutrientTitle);
                yArray.push(value);
                // console.log("x: ", xArray);
                // console.log("y: ", yArray);
            }
        };
        var data = [
            {
                x: xArray,
                y: yArray,
                type: 'bar'
            }
        ];
        Plotly.newPlot('myDiv', data);
    };


    // This function builds the detail view page
    var buildDetailPage = function () {
        measureOption = 0;
        NDBOID = getUrlVars()["NDBOID"];
        foodNameString = getUrlVars()["foodNameString"];
        console.log("foodNameString:", foodNameString);
        giphySearchString = encodeURIComponent(foodNameString);
        nutritionDetailAjax(NDBOID);
        gifRequest(giphySearchString);
        displayMyPLate(foodNameString);
    };
    buildDetailPage();


});
