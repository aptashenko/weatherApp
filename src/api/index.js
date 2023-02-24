import axios from 'axios';

const API_KEY = '6325b4fe83f393e3f9a9f833822a54f7'

export const fetchCities = async (value) => {
    try {
        const { data } = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=20&appid=${API_KEY}`)
        return data
    } catch(err) {
        console.log('err', err)
    }
};

export const fetchWeather = async (cityName) => {
    try {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)
        return data;
    } catch(err) {
        return err
    }
}

export const fetchWeatherChartData = async (cityName) => {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`)
    return data
}
