$(document).ready(function () {

    var measureOption = 0;
    var queryResults;
    var NDBOID = 0;


    var nutrientNames = {
        // 208: "Calories",
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
                displayNutritionResults(queryResults, NDBOID);
            });
    };


    var displayNutritionResults = function (queryResults, NDBOID) {
        var nutritionViewDiv = $('#nutrition-view');
        var foodTitle = $('<h2 id="food-title">');
        foodTitle.text(queryResults.foods[0].food.desc.name);
        nutritionViewDiv.empty();
        nutritionViewDiv.append(foodTitle);
        nutritionViewDiv.append(nutritionLabelSelector(NDBOID));
    };


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














    $('.food').on("click", function () {
        console.log("hi");
        NDBOID = $(this).attr("value");
        console.log("*Click!* Food button clicked.", NDBOID);
        nutritionDetailAjax(NDBOID);
        window.location = "detail.html";
    });



});