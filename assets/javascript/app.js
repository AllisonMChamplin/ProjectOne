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

    $('#food-img-click').on('click', 'div', function (event) {
        NDBOID = $(this).attr("value");
        console.log("*Click!* Food button clicked.", NDBOID);
        nutritionDetailAjax(NDBOID);
    });


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
                displayNutritionResults(NDBOID);
            });
    };


    var displayNutritionResults = function (NDBOID) {
        var nutritionViewDiv = $('#nutrition-view');
        nutritionViewDiv.empty();
        nutritionViewDiv.append(nutritionLabelSelector(NDBOID));
    };


    var nutritionLabelSelector = function (NDBOID) {
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
        return labelWrapper.html();
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


    var refreshNutrientTable = function (NDBOID) {
        console.log("refresh");
        $('#table-wrapper').empty();
        $('#table-wrapper').append(nutrientTable());
        measureOption = 0;
    };



});