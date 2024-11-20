// const express = require('express');
// const app = express();
// const port = 7000;

// // Sample data
// const data = {
//     days: 10,
//     hours: 5,
//     minutes: 30,
//     seconds: 15,
//     soilTemperature: 25.5,
//     humidity: 60,
//     topLayer: 'Moist',
//     middleLayer: 'Dry',
//     bottomLayer: 'Wet'
// };

// // Serve the data as JSON
// app.get('/data', (req, res) => {
//     res.json(data);
// });

// // Serve static HTML files
// app.use(express.static('public'));

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });



const express = require('express');
const axios = require('axios');
const app = express();
const port = 7000;

// Sample data
let data = {
    days: 10,
    hours: 0,
    minutes: 0,
    seconds: 0,
    soilTemperature: 25.5,
    humidity: 60,
    Temperature : 27,
    topLayer: 'Moist',
    middleLayer: 'Dry',
    bottomLayer: 'Wet',
    prediction:123,
};

// Function to fetch data from ThingSpeak
const fetchThingSpeakData = async () => {
    try {
        const response = await axios.get('https://api.thingspeak.com/channels/2446509/feeds.json?results=1');
        const feed = response.data.feeds[0];

        // Assuming the ThingSpeak channel stores the hours, minutes, and seconds in fields 1, 2, and 3
        data.hours = feed.field2;
        data.minutes = feed.field3;
        data.seconds = feed.field4;
        data.days = feed.field1;

    } catch (error) {
        console.error('Error fetching data from ThingSpeak:', error);
    }
};

// data from second channel

const fetchThingSpeakData2 = async () => {
    try {
        const response = await axios.get('https://api.thingspeak.com/channels/2445757/feeds.json?results=1');
        const feed = response.data.feeds[0];

        // Assuming the ThingSpeak channel stores additional data in fields 1 and 2
        data.humidity = feed.field5;
        data.bottomLayer = feed.field1;
        data.middleLayer = feed.field2;
        data.topLayer = feed.field3;
        data.Temperature = feed.field4;
        data.prediction = feed.field7;


    } catch (error) {
        console.error('Error fetching data from ThingSpeak channel 2345:', error);
    }
};

// Middleware to update data before responding
app.use(async (req, res, next) => {
    await fetchThingSpeakData();
    await fetchThingSpeakData2();
    next();
});

// Serve the data as JSON
app.get('/data', (req, res) => {
    res.json(data);
});

// Serve static HTML files
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
