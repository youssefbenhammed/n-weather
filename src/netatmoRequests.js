import {NETATMO_API_KEY} from './constants'

export async function getWeatherData(lat_ne,lon_ne,lat_sw,lon_sw){
    const response = await fetch('https://api.netatmo.com/api/getpublicdata?lat_ne='+lat_ne+'&lon_ne='+lon_ne+'&lat_sw='+lat_sw+'&lon_sw='+lon_sw+'&filter=true', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Authorization': 'Bearer ' + NETATMO_API_KEY},
        mode: 'cors'
      }).then(function (a) {
        return a.json(); // call the json method on the response to get JSON
    })
    return response;
}

export default {getWeatherData};