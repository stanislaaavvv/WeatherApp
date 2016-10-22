/**
 * Created by user on 10/20/16.
 */
document.addEventListener('DOMContentLoaded',function() {

    //Choice(id of selected city from first drop down menu) for ajax request
    var firstSelect = document.getElementById('city-names');

    firstSelect.addEventListener('change',function(){
        var optionID = this.options[this.selectedIndex].id;
        update.sendAjaxRequest(optionID);
    },false)

    //Sends data to DB
    var button = document.getElementById('insert');

    button.addEventListener('click',function(){
        var data = document.getElementById('city-names').selectedIndex - 1;

        Ajax.request('POST', 'http://localhost/Homeworks/WeatherApp/model/insertFavourite.php', true, function() {

        },{data:data});
    //Update favourites section
        update.fetchFavourites();

    },false);

    //Fetch favourites
    update.fetchFavourites();

    //Change main section from favourite drop down
    var favouriteSelect = document.getElementById('favourites');
    favouriteSelect.addEventListener('change',function(){
        var index = parseInt(favouriteSelect.options[favouriteSelect.selectedIndex].id) + 1;
        firstSelect.selectedIndex = index;
        var ajaxValue = firstSelect.options[firstSelect.selectedIndex].id;
        update.sendAjaxRequest(ajaxValue);
    },false)
},false);

