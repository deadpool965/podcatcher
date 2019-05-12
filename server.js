const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { readFileSync } = require('fs');
const NodeCache = require('node-cache');

dotenv.config();

const cache = new NodeCache({
  stdTTL: 60 * 60, // hourly
  checkperiod: 60 * 60,
  deleteOnExpire: true,
});
const app = express();

const cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
};

const indexFile = (() => readFileSync('./build/index.html', { encoding: 'utf-8' }))();

const fetch = async (url) => {
  const cachedValue = cache.get(url);

  if (cachedValue) {
    return cachedValue;
  }

  const { data } = await axios(url);
  cache.set(url, data, 60 * 60);
  return data;
};

const lookup = (req, res) => res.send('lookup');
const search = (req, res) => res.send('search');
const topCharts = async (req, res) => {
  try {
    const country = req.query.country || 'us';
    const limit = req.query.limit || 50;
    const data = await fetch(`https://rss.itunes.apple.com/api/v1/${country}/podcasts/top-podcasts/all/${limit}/explicit.json`);
    res.send(data.feed.results);
  } catch (e) {
    res
      .status(500)
      .send(e);
  }
};

app.get('/api/lookup', cors, lookup);
app.get('/api/search', cors, search);
app.get('/api/topcharts', cors, topCharts);
app.use(express.static('./build'));
app.get('*', (req, res) => res.send(indexFile));

app.listen(process.env.SERVER_PORT, () => console.log(`Ready on ${process.env.SERVER_PORT}`));
