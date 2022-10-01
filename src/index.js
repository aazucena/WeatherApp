var cron = require('cron').CronJob;
var Big = require('big.js')
var fs = require('fs')


const element = (name) => document.getElementById(name)

var cache = {}

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

const generateCurrentWeather = async() => {
    var { open_weather_api: { meta, data: forecast } } = await retrieveForecast()
    if (meta.status === 200 && meta.statusText === 'OK' && meta.ok === true) {
        var { main, weather , wind, timezone, visibility, clouds, coord, sys } = forecast
        const setCurrentWeather = ({ 
                temp, description, 
                icon, wind, w_id,
                maxtemp, mintemp, dew_point, 
                humidity, utc_offset }) => {
            element("temp").innerHTML = `${Math.round(temp)}&deg;C`
            element("description").innerHTML = description
            element("dew_point").innerHTML = `${dew_point}&deg;C`
            element("weather").innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@4x.png" class="image-fluid" alt="${w_id}"/>`
            element("mintemp").innerHTML = `${mintemp}&deg;C`
            element("maxtemp").innerHTML = `${maxtemp}&deg;C`
            element("wind").innerHTML = `${wind.speed}km/h ${wind.deg}&deg;`
            element("humidity").innerHTML = `${humidity}RH%`
            element("time").innerHTML = moment().utcOffset(utc_offset/60).format('hh:mmA')
        }
        var date = {
            sunrise: moment.unix(sys.sunrise).format('hh:mmA'),
            sunset: moment.unix(sys.sunset).format('hh:mmA')
        }
        console.log("🚀 ~ file: index.js ~ line 29 ~ job ~ date", date)
        const weather_info = {
            temp: main.temp,
            description: weather?.at(0).description, 
            icon: weather?.at(0).icon, 
            w_id: weather?.at(0).id, 
            wind: wind,
            dew_point: main.dew_point,
            maxtemp: main.temp_max, 
            mintemp: main.temp_min, 
            humidity: main.humidity,
            utc_offset: timezone,
        }
        setCurrentWeather(weather_info)
    }
}

window.onload = async() => {
    await generateCurrentWeather()
    var job = new cron('* * * * * *', async() => {
        await generateCurrentWeather()
    }, null, true)
    job.start()
    console.log("all info received from server")
}

const retrieveForecast = async() => {
    var APIkey = "712e884a43143ab7711a408902440f8f" //insert your API key from open weather map https://home.openweathermap.org/users/sign_up
    var geoLocation = "lethbridge,ca"
    var url = `https://api.openweathermap.org/data/2.5/weather?q${'='}${geoLocation}&units=metric&APPID=${APIkey}`
    var weatherURL = `https://weatherdbi.herokuapp.com/data/weather/${geoLocation}`
    var response = await fetch(url, {
        method: 'GET',
    })
    // var weatherResponse = await fetch(weatherURL, {
    //     method: 'GET',
    // })
    var data = await response.json().then((item) => ({
        ...item,
        main: {
            ...item?.main ?? {},
            dew_point: dewPoint(item.main.temp, item.main.humidity),
        }
    }))
    // var weatherData = await weatherResponse.json()
    return {
        open_weather_api: {
            meta: response,
            data,
        },
        // weatherdbi: {
        //     meta: weatherResponse,
        //     data: weatherData,
        // }
    }
}