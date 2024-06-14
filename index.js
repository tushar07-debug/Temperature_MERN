const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDBy

mongoose.connect('mongodb://localhost:27017/weatherDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Schema and Model
const temperatureSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  date: { type: Date, default: Date.now }
});

const Temperature = mongoose.model('Temperature', temperatureSchema);

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse application/json
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(__dirname + '/public'));

// GET route for the main page
app.get('/', function (req, res) {
  res.render('index', { temp: null });
});

// POST route to fetch and store temperature data
app.post('/fetch_data', async function (req, res) {
  const cityName = req.body.city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=`;

  try {
    const response = await axios.get(url);
    const temp = response.data.main.temp;
    const newTemperature = new Temperature({ city: cityName, temperature: temp });

    await newTemperature.save();
    console.log('Temperature data saved successfully');

    res.render('index', { temp: temp });
  } catch (error) {
    console.error(error);
    res.render('index', { temp: null });
  }
});

// GET route to fetch temperature data for visualization
app.get('/temperature_data', async (req, res) => {
  try {
    const temperatures = await Temperature.find({});
    res.json(temperatures);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

app.listen(3000, function () {
  console.log('Server is running on port 3000');
});

