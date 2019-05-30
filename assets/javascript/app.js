$(document).ready(function () {

    $('#food-img-click').on('click', 'div', function (event) {
        var NDBOID = $(this).attr("value");
        console.log("*Click!* Food button clicked.", NDBOID);
        // var resultsDiv = $('#nutrition-view');
        var data = nutritionDetailAjax(NDBOID);
        $('#nutrition-view').empty();
        $('#nutrition-view').html('<img src="./assets/images/8.gif">')
        // resultsDiv.empty();
    });

    // AJAX request to the USDA Report
    var nutritionDetailAjax = function (NDBOID) {
        if (!NDBOID) {
            console.log("No NDBOID! Return false.");
            return false;
        }
        // https://api.nal.usda.gov/ndb/V2/reports?ndbno=01009&ndbno=01009&ndbno=45202763&ndbno=35193&type=b&format=json&api_key=DEMO_KEY
        var APIKEY = "MTThsOXeyC4yDoAe048samFSx66c0bbwi0HO6m4G";
        var queryURL = "https://api.nal.usda.gov/ndb/V2/reports?ndbno=" + NDBOID + "&format=json&max=5&offset=0&type=f&api_key=" + APIKEY;
        console.log("nutritionDetailAjax queryURL", queryURL);
        // AJAX request with the queryURL
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                // storing the data from the AJAX request in the results variable
                var results = response;
                console.log("nutritionDetailAjax Results:", results);
                displayNutritionResults(results, NDBOID);
            });
    };

    // Build the nutrition detail view
    var displayNutritionResults = function (results, NDBOID) {
        var photoURL = photoDisplay(NDBOID);
        var label = nutritionLabel(results, NDBOID);
        var nutritionViewDiv = $('#nutrition-view');
        nutritionViewDiv.empty();
        var foodName = results.foods[0].food.desc.name;
        var foodNameHeading = $('<h1>');
        foodNameHeading.text(foodName);
        var nutritionRowTop = $('<div class="row"><div class="col top-left">' + '<img src="' + photoURL + '">' + '</div><div class="col top-right">' + label + '</div></div>');
        var nutritionRowBottom = $('<div class="row"><div class="col bottom-left">MyPlate<br>*** Add food group name here from API, and then figure out how to add myPlate group ***</div><div class="col bottom-right">Macros pie chart</div></div>')
        nutritionViewDiv.append(foodNameHeading, nutritionRowTop, nutritionRowBottom);
    };

    // Build the nutrition label
    var nutritionLabel = function (results, NDBOID) {
        var data = results.foods[0].food;
        var label = $('<div class="label">');
        var labelWrapper = $('<div class="label-wrapper clearfix">');
        var mainHeadingDiv = $('<div class="label-header">Nutrition Facts</div>');
        var servingsDiv = $('<div class="servings clearfix"><div class="nutrient">Serving Size: </div><div class="nutrient-value">100g</div></div>');
        var caloriesDiv = $('<div class="calories clearfix"><div class="nutrient">Calories: </div>' + '<div class="nutrient-value"> ' + data.nutrients[2].value +  data.nutrients[4].unit + '</div></div>');
        var proteinDiv = $('<div class="protein clearfix"><div class="nutrient">Protein: </div>' + '<div class="nutrient-value"> ' + data.nutrients[4].value + data.nutrients[4].unit + '</div></div>');
        var fatDiv = $('<div class="fat clearfix"><div class="nutrient">Fat: </div>' + '<div class="nutrient-value"> ' + data.nutrients[5].value + data.nutrients[5].unit + '</div></div>');
        var carbDiv = $('<div class="carbs clearfix"><div class="nutrient">Carbs: </div>' + '<div class="nutrient-value"> ' + data.nutrients[7].value + data.nutrients[7].unit + '</div></div>');

        labelWrapper.append(mainHeadingDiv);
        labelWrapper.append(servingsDiv);
        labelWrapper.append(caloriesDiv);
        labelWrapper.append(proteinDiv);
        labelWrapper.append(fatDiv);
        labelWrapper.append(carbDiv);
        label.append(labelWrapper);
        // console.log("labelWrapper.html()", labelWrapper.html());
        // console.log("results: ", results);
        return label.html();
    };

    // Show food photo on nutrition view
    var photoDisplay = function (NDBOID) {
        console.log("hi");
        console.log(NDBOID);
        if (NDBOID == 11124) {
            var imgURL = "http://lorempixel.com/output/food-q-c-640-480-5.jpg";
            return imgURL;
        } else if (NDBOID == 28361) {
            var imgURL = "http://cf.sunnywithachanceofsprinkles.com/wp-content/uploads/2016/01/italian-and-garlic-goldfish-31.png";
            return imgURL;
        } else if (NDBOID == 09252) {
            var imgURL = "https://usapears.org/wp-content/uploads/2018/11/all-pears.png";
            return imgURL;
        } else if (NDBOID == 09040) {
            var imgURL = "https://www.countrydoctornutritionalcenter.com/wp-content/uploads/2018/08/64D364B3-449C-4741-B82D-BC5764C294A7.png";
            return imgURL;
        } else if (NDBOID == 09003) {
            var imgURL = "http://onapples.com/uploads/varieties/3y3v9tyf8h96.png";
            return imgURL;
        };
    };


});