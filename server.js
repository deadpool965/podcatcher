const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const rss2json = require('rss-to-json');
const {
  readFileSync,
  writeFileSync,
  statSync,
  existsSync,
} = require('fs');

dotenv.config();

const cache = {
  path: (key) => {
    return `./cache/${key.replace(/[^a-zA-Z0-9]/gi, '_')}.cache`;
  },
  set: (key, value) => {
    writeFileSync(cache.path(key), JSON.stringify(value), { encoding: 'utf-8' });
  },
  get: (key) => {
    try {
      const data = JSON.parse(readFileSync(cache.path(key), { encoding: 'utf-8' }));
      return data;
    } catch (e) {
      return false;
    }
  },
  expired: (key) => {
    const path = cache.path(key);
    if (!existsSync(path)) return false;
    const { mtime } = statSync(path);
    const exp = new Date(mtime);
    const now = new Date();
    const dif = (now - exp) / 1000;
    return dif > 60 * 60 * 6;
  },
};

const app = express();

const cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
};

const indexFile = (() => readFileSync('./build/index.html', { encoding: 'utf-8' }))();

const fetch = async (url) => {
  const cachedValue = cache.get(url);
  const fetchAndCache = async () => {
    const { data } = await axios(url);
    cache.set(url, data);
    return data;
  };

  if (cachedValue) {
    if (cache.expired(url)) {
      fetchAndCache();
    }
    return cachedValue;
  }

  const data = await fetchAndCache();
  return data;
};

const find = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await fetch(`https://itunes.apple.com/lookup?id=${id}`);
    res.send(data.results[0]);
  } catch (e) {
    res
      .status(500)
      .send(e);
  }
};

const episode = async (req, res) => {
  const { id } = req.params;
  const fetchAndCache = () => new Promise(async (resolve, reject) => {
    try {
      const data = await fetch(`https://itunes.apple.com/lookup?id=${id}`);
      const { feedUrl } = data.results[0];
      rss2json.load(feedUrl, (error, jsonRSS) => {
        if (error) {
          reject(error);
          return;
        }
        const result = jsonRSS.items;
        cache.set(id, result);
        resolve(result);
      });
    } catch (e) {
      reject(e);
    }
  });

  try {
    const cachedValue = cache.get(id);
    if (cachedValue) {
      if (cache.expired(id)) {
        fetchAndCache();
      }
      res.send(cachedValue);
      return;
    }

    const rss = await fetchAndCache();
    res.send(rss);
  } catch (e) {
    res
      .status(500)
      .send(e);
  }
};

const search = async (req, res) => {
  try {
    const searchParams = `${Object
      .keys(req.query)
      .map(k => `${k}=${encodeURI(req.query[k])}`)
      .join('&')}`;
    const data = await fetch(`https://itunes.apple.com/search?${searchParams}`);
    res.send(data);
  } catch (e) {
    res
      .status(500)
      .send(e);
  }
};

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

app.get('/api/podcast/:id', cors, find);
app.get('/api/episodes/:id', cors, episode);
app.get('/api/search', cors, search);
app.get('/api/topcharts', cors, topCharts);
app.use(express.static('./build'));
app.get('*', (req, res) => res.send(indexFile));

app.listen(process.env.SERVER_PORT, () => console.log(`Ready on ${process.env.SERVER_PORT}`));
