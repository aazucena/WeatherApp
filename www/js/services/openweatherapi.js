import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import axios from 'axios';

const OpenWeatherApi =  axios.create({
    baseURL: 'http://api.openweathermap.org/data/2.5/',
    params: {
        appid: process.env.apiKey,
    },
});