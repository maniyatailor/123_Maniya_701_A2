const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Replace with your OpenWeatherMap API key
const API_KEY = '1ab17187472efcf1336e14ce7abe7df1';

app.get('/api/weather', async (req, res) => {
  const { city = 'Delhi' } = req.query;
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (err) {
    let errorMsg = err.message;
    let details = err.response && err.response.data ? err.response.data : null;
    res.status(500).json({ error: errorMsg, details });
  }
});

app.listen(3002, () => console.log('Weather API server running on 3002'));
