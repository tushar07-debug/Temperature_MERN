const express = require('express')
const app = express()
const axios = require('axios')
const bodyParser = new require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.set( __dirname + '/index');

app.get('/', function (req, res) {
    res.render('index', { temp: null })
})
app.post('/fetch_data', function (req, res) {
    const cityName = req.body.city
    console.log(cityName)
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=d7b88ee07fb5e40ee8dd89b0229605f5&units=metric"
    axios.get(url)
    .then(function (response) {
    console.log(response)
    res.render('index', { temp: response['data']['main']['temp'] })
});

})
app.listen(3000)