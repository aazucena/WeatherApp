// var cron = require('cron').CronJob;
// var Big = require('big.js')
// var fs = require('fs')

// const element = (name) => document.getElementById(name)

// var cache = {}


// const retrieveForecast = async() => {
//     var APIkey = "712e884a43143ab7711a408902440f8f" //insert your API key from open weather map https://home.openweathermap.org/users/sign_up
//     var geoLocation = "lethbridge,ca"
//     var url = `https://api.openweathermap.org/data/2.5/weather?q${'='}${geoLocation}&units=metric&APPID=${APIkey}`
//     var weatherURL = `https://weatherdbi.herokuapp.com/data/weather/${geoLocation}`
//     var response = await fetch(url, {
//         method: 'GET',
//     })
//     // var weatherResponse = await fetch(weatherURL, {
//     //     method: 'GET',
//     // })
//     var data = await response.json().then((item) => ({
//         ...item,
//         main: {
//             ...item?.main ?? {},
//             // dew_point: dewPoint(item.main.temp, item.main.humidity),
//         }
//     }))
//     // var weatherData = await weatherResponse.json()
//     return {
//         open_weather_api: {
//             meta: response,
//             data,
//         },
//         // weatherdbi: {
//         //     meta: weatherResponse,
//         //     data: weatherData,
//         // }
//     }
// }

// const generateCurrentWeather = async() => {
//     var { open_weather_api: { meta, data: forecast } } = await retrieveForecast()
//     if (meta.status === 200 && meta.statusText === 'OK' && meta.ok === true) {
//         var { main, weather , wind, timezone, visibility, clouds, coord, sys } = forecast
//         const setCurrentWeather = ({ 
//                 temp, description, 
//                 icon, wind, w_id,
//                 maxtemp, mintemp, dew_point, 
//                 humidity, utc_offset }) => {
//             element("temp").innerHTML = `${Math.round(temp)}&deg;C`
//             element("description").innerHTML = description
//             // element("dew_point").innerHTML = `${dew_point}&deg;C`
//             element("weather").innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@4x.png" class="image-fluid" alt="${w_id}"/>`
//             element("mintemp").innerHTML = `${mintemp}&deg;C`
//             element("maxtemp").innerHTML = `${maxtemp}&deg;C`
//             element("wind").innerHTML = `${wind.speed}km/h ${wind.deg}&deg;`
//             element("humidity").innerHTML = `${humidity}RH%`
//             element("time").innerHTML = moment().utcOffset(utc_offset/60).format('hh:mmA')
//         }
//         var date = {
//             sunrise: moment.unix(sys.sunrise).format('hh:mmA'),
//             sunset: moment.unix(sys.sunset).format('hh:mmA')
//         }
//         console.log("🚀 ~ file: index.js ~ line 29 ~ job ~ date", date)
//         const weather_info = {
//             temp: main.temp,
//             description: weather?.at(0).description, 
//             icon: weather?.at(0).icon, 
//             w_id: weather?.at(0).id, 
//             wind: wind,
//             dew_point: main.dew_point,
//             maxtemp: main.temp_max, 
//             mintemp: main.temp_min, 
//             humidity: main.humidity,
//             utc_offset: timezone,
//         }
//         setCurrentWeather(weather_info)
//     }
// }

// window.onload = async() => {
//     await generateCurrentWeather()
//     // var job = new cron('* * * * * *', async() => {
//     //     await generateCurrentWeather()
//     // }, null, true)
//     // job.start()
//     console.log("all info received from server")
// }

const dewPoint = (temperature, relative_humidity) => {
    var magnus = {
        a: 17.625,
        b: 243.04,
    }
    /// Math.log(relative_humidity/100) + ((magnus.a * temperature) / (magnus.b + temperature))
    const aFunction = () => {
        var r_hum = new Big(relative_humidity).div(100).toNumber()
        var lh = new Big(Math.log(r_hum))
        var numer = new Big(magnus.a).mul(temperature)
        var denom = new Big(magnus.b).plus(temperature)
        var rh = numer.div(denom)
        return lh.plus(rh).round(2).toNumber()
    }

    var left_hand = new Big(magnus.b).mul(aFunction())
    var right_hand = new Big(magnus.a).minus(aFunction())
    var result = left_hand.div(right_hand).round(2).toNumber()
    return result
}

var res
var weatherURL

var APIkey = "712e884a43143ab7711a408902440f8f" //insert your API key from open weather map https://home.openweathermap.org/users/sign_up
var location = {
    city: 'lethbridge',
    country: 'ca',
}
var place = `${location.city},${location.country}` // option to change location 

window.onload = function () {  
    weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + place + "&units=metric&APPID=" + APIkey;
    weather().then(() => {
        getWeather()
        setInterval(() => {
            getWeather()
        }, 1 * 30 * 1000)
    })
}

async function weather() {
    var response = await axios.get(weatherURL)
    res = response
}

function getWeather() { // when readystate changes
        
    //check to see if the client -4 and server -200 is ready
    if (res.request.readyState === 4 && res.request.status === 200) {

        var json = res.data
        console.log("🚀 ~ file: index.js ~ line 134 ~ getWeather ~ json", json)
        // var { main, weather , wind, timezone, visibility, clouds, coord, sys } = JSON.parse(xmlhttp.responseText);

        function currentWeather ( 
                temp, description, 
                icon, w_id, wind_speed, wind_direction,
                feels_like,
                maxtemp, mintemp, dew_point,
                humidity, utc_offset, sunrise, sunset) {
            document.getElementById("temp").innerHTML = `${new Big(temp).round(1).toNumber()}&deg;C`
            document.getElementById("description").innerHTML = description
            document.getElementById("dew_point").innerHTML = `${new Big(dew_point).round(1).toNumber()}<sup class="fs-1">&deg;C</sup>`
            document.getElementById("weather").innerHTML = `<i class="wi ${retrieveIcon(w_id, icon)}"></i>`
            document.getElementById("mintemp").innerHTML = `${new Big(mintemp).round(1).toNumber()}&deg;C`
            document.getElementById("maxtemp").innerHTML = `${new Big(maxtemp).round(1).toNumber()}&deg;C`
            document.getElementById("feels_like").innerHTML = `feels like ${new Big(feels_like).round(1).toNumber()}&deg;C`
            document.getElementById("wind").innerHTML = `${new Big(wind_speed).round(1).toNumber()}<sup class="fs-1">km/h</sup>`
            document.getElementById("humidity").innerHTML = `${humidity}<sup class="fs-1">%</sup>`
            document.getElementById("time").innerHTML = moment().utcOffset(utc_offset/60).format('hh:mmA')
            document.getElementById("location").innerHTML = location.city
            document.getElementById("sunrise").innerHTML = `${sunrise.time}<sup class="fs-1">${sunrise.abbv}</sup>`
            document.getElementById("sunset").innerHTML = `${sunset.time}<sup class="fs-1">${sunset.abbv}</sup>`
        }

        var date = {
            sunrise: { time: moment.unix(json.sys.sunrise).format('hh:mm'), abbv: moment.unix(json.sys.sunrise).format('A')},
            sunset: { time: moment.unix(json.sys.sunset).format('hh:mm'), abbv: moment.unix(json.sys.sunset).format('A')}
        }
        // const weather_info = {
        //     temp: main.temp,
        //     description: weather?.at(0).description, 
        //     icon: weather?.at(0).icon, 
        //     w_id: weather?.at(0).id, 
        //     wind: wind,
        //     // dew_point: main.dew_point,
        //     maxtemp: main.temp_max, 
        //     mintemp: main.temp_min, 
        //     humidity: main.humidity,
        //     utc_offset: timezone,
        // }
        
        var current = new currentWeather(json.main.temp, json.weather[0].description,
            json.weather[0].icon, json.weather[0].id, json.wind.speed, json.wind.deg, 
            json.main.feels_like, json.main.temp_max, json.main.temp_min, 
            dewPoint(json.main.temp, json.main.humidity), json.main.humidity, 
            json.timezone, date.sunrise, date.sunset)

        console.log("all info received from server")

    } else {
        console.log("no dice");
    }
}

const retrieveIcon = (id, icon_code) => {
    var getDayCode = () => {
        switch (true) {
            case icon_code.includes('n'):
                return 'night'
            case icon_code.includes('d'):
                return 'day'
            default:
                throw new Error('Cannot retrieve day code.')
        }
    }
    var code = getDayCode()
    switch(id) {
        case 200: // thunderstorm with light rain	
        case 201: // thunderstorm with rain
        case 202: // thunderstorm with heavy rain
            return `wi-${code}-sleet-storm`
        case 210: // light thunderstorm
        case 211: // thunderstorm
        case 212: // heavy thunderstorm
        case 221: // ragged thunderstorm
            return `wi-${code}-thunderstorm`
        case 230: // thunderstorm with light drizzle
        case 231: // thunderstorm with drizzle
        case 232: // thunderstorm with heavy drizzle
            return `wi-${code}-storm-showers`
        case 300: // light intensity drizzle
        case 301: // drizzle
        case 302: // heavy intensity drizzle
        case 310: // light intensity drizzle rain
        case 311: // drizzle rain
        case 312: // heavy intensity drizzle rain
        case 313: // shower rain and drizzle
        case 314: // heavy shower rain and drizzle
        case 321: // shower drizzle
            return `wi-${code}-sprinkle`
        case 500: // light rain
        case 501: // moderate rain
            return `wi-${code}-rain`
        case 502: // heavy intensity rain
        case 503: // very heavy rain
        case 504: // extreme rain
        case 511: // freezing rain
            return `wi-${code}-rain-wind`
        case 520: // light intensity shower rain
        case 521: // shower rain
        case 522: // heavy intensity shower rain
        case 531: // ragged shower rain
            return `wi-${code}-showers`
        case 600: // light snow
        case 601: // snow
        case 602: // heavy snow
            return `wi-${code}-snow`
        case 611: // sleet
        case 612: // light shower sleet
        case 613: // shower sleet
            return `wi-${code}-sleet`
        case 615: // light rain and snow
        case 616: // rain and snow
        case 620: // light shower snow
        case 621: // shower snow
        case 622: // heavy shower snow
            return `wi-${code}-rain-mix`
        case 701: // mist
            return `wi-${code}-fog`
        case 711: // smoke
            return `wi-smoke`
        case 721: // haze
            return code === 'day' ? `wi-${code}-haze` : `wi-fog`
        case 731: // sand/dust whirls
            return `wi-sandstorm`
        case 741: // fog
            return `wi-fog`
        case 751: // sand 
        case 761: // dust
            return `wi-dust`
        case 762: // volcanic ash
            return `wi-volcano`
        case 771: // squalls 
            return `wi-hurricane`
        case 781: // tornado
            return `wi-tornado`
        case 800: // clear sky
            return code === 'day' ? `wi-day-sunny` : `wi-night-clear`
        case 801: // few clouds 11-25%
            return `wi-${code}-cloudy`
        case 802: // scattered clouds 25-50%
            return `wi-cloud`
        case 803: // broken clouds 51-84%
            return `wi-cloudy`
        case 804: // overcast clouds 85-100%
            return `wi-${code}-cloudy-high`
        default:
            return `wi-na`
    }
}