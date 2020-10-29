function initPage() {
    //Gets city inputted by user
    const inputEl = document.getElementById("city-input");

    //Variable used to search   
    const searchEl = document.getElementById("search");

    //Variable used to clear history
    const clearEl = document.getElementById("clear-history");
    
    //Gets city
    const nameEl = document.getElementById("city");

    //Gets picture to depict the current weather conditions
    const currentPicEl = document.getElementById("weather-pic");
   
    //Gets temperature
    const currentTempEl = document.getElementById("temperature");
   
    //Gets humidity
    const currentHumidityEl = document.getElementById("humidity");

    //Gets wind speed
    const currentWindEl = document.getElementById("wind");

    //Gets  UV Index
    const currentUVEl = document.getElementById("UV");

    //Gets search history
    const historyEl = document.getElementById("history");
    
    //Used to store search history based on local storage
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    //Assigns my API key
    const APIKey = "0b9d3a2556f2f35c86f5d0781f1b8483";
    //When search button is clicked, read the city name typed by the user

    //Function to pull the current weather conitions and the 5-Day forceast
    function getWeather(cityName) {
        //Pull the current weather conditions based on the city from the weather API
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
        
        .then(function(response){    
        //Get date
        const currentDate = new Date(response.data.dt*1000);
        
        //Get day
        const day = currentDate.getDate();
        
        //Get month
        const month = currentDate.getMonth() + 1;

        //Get year
        const year = currentDate.getFullYear();
       
       //Displays the month, day, and year 
        nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
       
       //Displays weather graphic for current conditions
        let weatherPic = response.data.weather[0].icon;
        currentPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
        currentPicEl.setAttribute("alt",response.data.weather[0].description);
        
        //Displays temperature
        currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";

        //Displays humidity
        currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";

        //Displays wind speed
        currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
        
        //Pulls latitude and longitude to get the UV Index
        let lat = response.data.coord.lat;
        let lon = response.data.coord.lon;
        let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
        axios.get(UVQueryURL)
        .then(function(response){
            let UVIndex = document.createElement("span");
            UVIndex.setAttribute("class","badge badge-danger");
            UVIndex.innerHTML = response.data[0].value;
            currentUVEl.innerHTML = "UV Index: ";
            currentUVEl.append(UVIndex);
    });

    //  Based on the city, pull the 5-day forecast from OpenWeather API
    let cityID = response.data.id;
    let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
    axios.get(forecastQueryURL)
    .then(function(response){

        //  Displays 5-Day forecast underneath the current weather conditions
        const forecastEls = document.querySelectorAll(".forecast");
        for (i=0; i<forecastEls.length; i++) {
            forecastEls[i].innerHTML = "";
            const forecastIndex = i*8 + 4;
            
            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
            //Gets forecast date
            const forecastDay = forecastDate.getDate();

            //Gets forecast month
            const forecastMonth = forecastDate.getMonth() + 1;
            
            //Gets forecast year
            const forecastYear = forecastDate.getFullYear();
            const forecastDateEl = document.createElement("p");
            forecastDateEl.setAttribute("class","mt-3 mb-0 date");

            //Displays the forecastdate
            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
            forecastEls[i].append(forecastDateEl);
            const forecastWeatherEl = document.createElement("img");
            forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
            forecastWeatherEl.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
            forecastEls[i].append(forecastWeatherEl);
            const forecastTempEl = document.createElement("p");
           
            //Displays temperature
            forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
            forecastEls[i].append(forecastTempEl);
            const forecastHumidityEl = document.createElement("p");
           
            //Displays the humidity
            forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
            forecastEls[i].append(forecastHumidityEl);
            }
        })
    });  
}

//EventListener based on a click event to display the search history  and saves it to the local storage
searchEl.addEventListener("click",function() {
    const searchTerm = inputEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search",JSON.stringify(searchHistory));
    renderSearchHistory();
})

//EventListener based on click event to clear the search history 
clearEl.addEventListener("click",function() {
    searchHistory = [];
    renderSearchHistory();
})

function k2f(K) {
    return Math.floor((K - 273.15) *1.8 +32);
}

//Dispays list of cities based on search history
function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i=0; i<searchHistory.length; i++) {
        const historyItem = document.createElement("input");
        
        historyItem.setAttribute("type","text");
        historyItem.setAttribute("readonly",true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
        historyItem.addEventListener("click",function() {
            getWeather(historyItem.value);
        })
        historyEl.append(historyItem);
    }
}

    //Automatically generates current wather conditions and 5-day forecast for the last city searched for
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
}
initPage();