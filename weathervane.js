#!/usr/bin/env node

var request = require('request'),
    fs = require('fs'),
    weatherBaseUrl = 'http://api.wunderground.com/api/',
    weatherKey = '', // your key here
    conditionsEndPoint = '/conditions/q/{zip}.json',
    zipcode = process.argv[2] || '10012',
    conditionsUrl,
    weathermoji = {  // @TODO: should break this out into day/night objects for each entry
        "partly cloudy": "⛅ ",
        "mostly cloudy": "⛅ ",
        "sunny": "☀",
        "cloudy": "☁ ",
        "haze": "🌁 ",
        "scattered clouds": "☁ ",
        "overcast": "☁ ",
        "clear": "⛺ ",// 🌈   
        "thunderstorms": "⚡ ",
        "rain": "☔ ",
        "light rain": "☔ ",
        "light rain mist": "☔ ",
        "heavy thunderstorm rain mist": "☔ ⚡ 🌁 ",
        "heavy thunderstorm rain": "☔  ⚡ ",
        "snow": "❄"
    };

conditionsEndPoint = conditionsEndPoint.replace('{zip}', zipcode);
conditionsUrl = weatherBaseUrl + weatherKey + conditionsEndPoint;

// @TODO: should check if online before firing request
request(conditionsUrl, function (err, res, body) {
    if (err) {console.log('could not hit weather api'); }

    var parsedRes = JSON.parse(body),
        degreesF = parsedRes.current_observation.temp_f,
        condition = parsedRes.current_observation.weather.toLowerCase(),
        weatherString = parseInt(degreesF, 10) + 'F ' + weathermoji[condition];

    console.log('WeatherVane: ' + weatherString);

    // @TODO - use generic path for file.  consider setting zip and file path in .weatherrc file
    fs.writeFile('/Users/atx/.weather', weatherString, function (err) {
        if (err) { console.log('an error occurred while writing to weather.txt'); }
        // do nothing if save successful - not concerned with feedback here since this will be running from cron
    });
});

