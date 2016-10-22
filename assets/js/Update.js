/**
 * Created by user on 10/19/16.
 */
var cities = ['Sofia, Bulgaria','Varna, Bulgaria','Burgas, Bulgaria','Turnovo, Bulgaria','Plovdiv, Bulgaria','Stara Zagora, Bulgaria',
    'Ruse, Bulgaria' , 'Pleven, Bulgaria' , 'Dobrich, Bulgaria' , 'Sliven , Bulgaria' , 'Shumen , Bulgaria' , 'Pernik, Bulgaria' , 'Haskovo, Bulgaria',
    'Blagoevgrad, Bulgaria' , 'Vratsa, Bulgaria' , 'Gabrovo, Bulgaria' , 'Vidin, Bulgaria' , 'Montana, Bulgaria' , 'Razgrad, Bulgaria' , 'Turgovishte, Bulgaria'];

function Update(){
    this.choice = '';
    this.url = 'https://query.yahooapis.com/v1/public/yql';
    this.weatherData = '';
}

Update.prototype.sendAjaxRequest = function (choice) {
    this.choice = choice;
    var url = this.url;
    var yql = 'select title, units.temperature, item.forecast from weather.forecast where woeid in'+
        '(select woeid from geo.places where text="' + cities[this.choice] + '") and'+
        ' u = "C" limit 8 | sort(field="item.forecast.date", descending="false");';
    var that = this;

    Ajax.request('POST', url, true, function(response) {
        that.weatherData = JSON.parse(response);
        that.updateHTML();
    },{format:'json',q:yql});


};



Update.prototype.updateHTML = function() {
    var cityName = this.weatherData.query.results.channel[0].title.replace('Yahoo! Weather - ','');
    var imgPath;

    //Data with weather forecast for the first day and  arr of all days

    var firstDay = this.weatherData.query.results.channel[0].item.forecast;
    var arrDaysInf = [];

    for (var j = 0; j < this.weatherData.query.results.channel.length; j++) {
        arrDaysInf.push(this.weatherData.query.results.channel[j].item.forecast)
    }

    //Create HTML
    var container = document.getElementById('weatherData');
    container.innerHTML = '';

    var information = document.createElement('div');
    information.id = "information";
    container.appendChild(information);

    var label = document.createElement('div');
    label.className = "label";
    information.appendChild(label);

    var city = document.createElement('p');
    city.className = 'city';
    var day = document.createElement('p');
    day.className = 'day';
    var forecast = document.createElement('p');
    forecast.className = 'forecast';
    label.appendChild(city); label.appendChild(day); label.appendChild(forecast);

    var data = document.createElement('div');
    data.className = "data";
    information.appendChild(data);

    var weatherIMG = document.createElement('img');
    weatherIMG.className = "weather-img";
    var temperature = document.createElement('div');
    temperature.className = "temperature";
    var unitC = document.createElement('span');
    unitC.id = "unitC";
    unitC.innerHTML = "&#8451;";
    var line = document.createElement('span');
    line.innerHTML = " | ";
    var unitF = document.createElement('span');
    unitF.id = "unitF";
    unitF.innerHTML = "&#8457;";
    var dummyContainer = document.createElement('div');
    dummyContainer.id = "dummyData";

    data.appendChild(weatherIMG); data.appendChild(temperature); data.appendChild(unitC); data.appendChild(line); data.appendChild(unitF);
    data.appendChild(dummyContainer);

    //DUMMY DATA
    var dummy1 = document.createElement('p');
    dummy1.innerHTML = "Precipitation: 100%";
    var dummy2 = document.createElement('p');
    dummy2.innerHTML = "Humidity: 87%";
    var dummy3 = document.createElement('p');
    dummy3.innerHTML = "Wind: 21 km/h";
    dummyContainer.appendChild(dummy1); dummyContainer.appendChild(dummy2); dummyContainer.appendChild(dummy3);

    var forecastContainer = document.createElement('div');
    forecastContainer.className = "daily-forecast";
    container.appendChild(forecastContainer);

    for (var i = 0; i < arrDaysInf.length; i++) {
        var wrapper = document.createElement('div');
        wrapper.className = "dailyweather";
        wrapper.id = "Object"+i;
        forecastContainer.appendChild(wrapper);

        var dayofweek = document.createElement('p');
        dayofweek.className = "dayofweek";
        var forecastIMG = document.createElement('img');
        forecastIMG.className = 'forecast-img';
        wrapper.appendChild(dayofweek); wrapper.appendChild(forecastIMG);

        var insideWrapper = document.createElement('p');
        var maxT = document.createElement('span');
        maxT.className = "maxT";
        var minT = document.createElement('span');
        minT.className = "minT";
        insideWrapper.appendChild(maxT); insideWrapper.appendChild(minT);
        wrapper.appendChild(insideWrapper);
    }

    //Initialize DOM elements with values

    document.querySelector('.city').innerHTML = cityName;
    document.querySelector('.day').innerHTML = firstDay.day;
    document.querySelector('.forecast').innerHTML = firstDay.text;
    imgPath = this.chooseWeatherImg(firstDay.code);
    document.querySelector('.weather-img').src = imgPath;
    document.querySelector('.temperature').innerHTML = firstDay.high;

    for (var z = 0; z < arrDaysInf.length; z++) {
        document.querySelector('#Object'+ z +' .dayofweek').innerHTML = arrDaysInf[z].day;
        imgPath = this.chooseWeatherImg(arrDaysInf[z].code);
        document.querySelector('#Object'+ z +' .forecast-img').src = imgPath;
        document.querySelector('#Object'+ z +' .maxT').innerHTML = arrDaysInf[z].high + '&deg  ';
        document.querySelector('#Object'+ z +' .minT').innerHTML =  arrDaysInf[z].low + '&deg';

    }

    //Add events
    this.attachEvents(unitF,unitC);

};

Update.prototype.attachEvents = function (element1,element2) {
    //Convert temperature from F to C and and vice versa

    var changeTemperature = document.getElementsByClassName("temperature")[0];
    var unitF_Clicked = false;
    var unitC_Clicked = true;

    element1.addEventListener("click",function() {
        if (unitF_Clicked == false) {
            var temp = changeTemperature.innerHTML;
            element2.style.color = "#4221b1";
            element1.style.color = "#50332e";
            changeTemperature.innerHTML = Math.round((temp * 1.8) + 32);
            unitC_Clicked = false;
            unitF_Clicked = true;
        }
    },false);

    element2.addEventListener("click",function() {
        if (unitC_Clicked == false) {
            var temp = changeTemperature.innerHTML;
            element1.style.color = "#4221b1";
            element2.style.color = "#50332e";
            changeTemperature.innerHTML = Math.round((temp - 32) / 1.8);
            unitF_Clicked = false;
            unitC_Clicked = true;
        }
    },false);

    //Change data for the main section

    var weatherForecast = document.getElementsByClassName('dailyweather');
    var that = this;

    for (var i=0 ; i < weatherForecast.length ; i++) {
        weatherForecast[i].addEventListener('click',function(){
            for (var j=0; j < weatherForecast.length; j++) {
                weatherForecast[j].style.border = "none";
            }
            this.style.border = "1px solid #e9e9e9";
            this.style.borderRadius = "5px";
            var id = this.id;
            id = id.replace('Object','');
            var currDay = that.weatherData.query.results.channel[id].item.forecast;

            document.querySelector('.day').innerHTML = currDay.day;
            document.querySelector('.forecast').innerHTML = currDay.text;
            document.querySelector('.temperature').innerHTML = currDay.high;
            document.querySelector('.weather-img').src = that.chooseWeatherImg(currDay.code);
            //check if temperature is in F
            unitF_Clicked = false;
            unitC_Clicked = true;
            element2.style.color = "#50332e";
            element1.style.color = "#4221b1";

        },false)
    }
};

Update.prototype.fetchFavourites = function() {

    Ajax.request('POST','http://localhost/Homeworks/WeatherApp/model/fetchFavourite.php',true,function(resp){
        var favData = JSON.parse(resp);
        var count = favData.length;

        //Create HTML
        var parent = document.getElementById('favourites');
        parent.innerHTML = '';
        var emptyOption = document.createElement('option');
        parent.appendChild(emptyOption);

        for (var i = 0; i < count;  i++) {
            var el = document.createElement('option');
            el.id = favData[i].cityid;
            el.innerHTML = cities[favData[i].cityid];
            parent.appendChild(el);
        }
    });
};

Update.prototype.chooseWeatherImg = function (code) {
    var path = '';
    code = parseInt(code);
    switch (code){
        case 0:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 1:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 2:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 3:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 4:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 5:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 6:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 7:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 8:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 9:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 10:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 11:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 12:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 13:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 14:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 15:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 16:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 17:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 18:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 19:
            path =  "assets/weatherimg/cloudy.png";
            break;
        case 20:
            path =  "assets/weatherimg/cloudy.png";
            break;
        case 21:
            path =  "assets/weatherimg/cloudy.png";
            break;
        case 22:
            path =  "assets/weatherimg/cloudy.png";
            break;
        case 23:
            path =  "assets/weatherimg/cloudy.png";
            break;
        case 24:
            path =  "assets/weatherimg/cloudy.png";
            break;
        case 25:
            path =  "assets/weatherimg/cloudy.png";
            break;
        case 26:
            path =  "assets/weatherimg/cloudy.png";
            break;
        case 27:
            path =  "assets/weatherimg/cloudy.png";
            break;
        case 28:
            path =  "assets/weatherimg/cloudy.png";
            break;
        case 29:
            path =  "assets/weatherimg/cloudy.png";
            break;
        case 30:
            path =  "assets/weatherimg/cloudy.png";
            break;
        case 31:
            path =  "assets/weatherimg/sunnycloudy.png";
            break;
        case 32:
            path =  "assets/weatherimg/sunnycloudy.png";
            break;
        case 33:
            path =  "assets/weatherimg/sunnycloudy.png";
            break;
        case 34:
            path =  "assets/weatherimg/sunnycloudy.png";
            break;
        case 35:
            path =  "assets/weatherimg/cloudyrainy.png";
            break;
        case 36:
            path =  "assets/weatherimg/sunnycloudy.png";
            break;
        case 37:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 38:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 39:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 40:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 41:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 42:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 43:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 44:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 45:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 46:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 47:
            path =  "assets/weatherimg/rainy.png";
            break;
        case 3200:
            path =  "assets/weatherimg/sunnycloudy.png";
            break;
    }

    return path;

};


var update = new Update();
update.sendAjaxRequest(0);


