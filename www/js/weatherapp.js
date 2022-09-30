window.onload = async() => {  
    var { meta, data: forecast } = await retrieveForecast()
    if (meta.status === 200 && meta.statusText === 'OK' && meta.ok === true) {
        var { main, weather , wind } = forecast

        function setForecast ({ temp, description, icon, wind, maxtemp, mintemp, humidity }) {          
            document.getElementById("temp").innerHTML = Math.round(temp);
            document.getElementById("description").innerHTML = description;
            document.getElementById("mintemp").innerHTML = mintemp;
            document.getElementById("maxtemp").innerHTML = maxtemp;
            document.getElementById("wind").innerHTML = wind;
            document.getElementById("humidity").innerHTML = humidity;
        }
        const weather_info = {
            temp: main.temp,
            description: weather?.at(0).description, 
            icon: weather?.at(0).icon, 
            wind: wind.speed, 
            maxtemp: main.temp_max, 
            mintemp: main.temp_min, 
            humidity: main.humidity 
        }
        setForecast(weather_info)

        console.log("all info received from server")
    }
    console.log("🚀 ~ file: weatherapp.js ~ line 12 ~ window.onload=async ~ forecast", forecast)
}

const retrieveForecast = async() => {
    var APIkey = "712e884a43143ab7711a408902440f8f" //insert your API key from open weather map https://home.openweathermap.org/users/sign_up
    var geoLocation = "lethbridge,ca"
    var url = `https://api.openweathermap.org/data/2.5/weather?q${'='}${geoLocation}&units=metric&APPID=${APIkey}`
    var response = await fetch(url, {
        method: 'GET',
    })
    var data = await response.json()
    return {
        meta: response,
        data,
    }
}