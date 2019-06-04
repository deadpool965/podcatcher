const express = require('express');
const dotenv = require('dotenv');
const compression = require('compression');
const zlib = require('zlib');
const { readFileSync } = require('fs');
const cors = require('./server/middlewares/cors');

dotenv.config();

const app = express();
app.use(
  compression(
    {
      level: zlib.Z_BEST_COMPRESSION,
    },
  ),
);

const indexFile = (() => readFileSync('./build/index.html', { encoding: 'utf-8' }))();

const find = require('./server/routes/find');
const episode = require('./server/routes/episode');
const search = require('./server/routes/search');
const topCharts = require('./server/routes/topCharts');
const sitemap = require('./server/routes/sitemap');

app.get('/robots.txt', (req, res) => res.status(404).end());
app.get('/sitemap.xml', sitemap);
app.get('/api/podcast/:id', cors, find);
app.get('/api/episodes/:id', cors, episode);
app.get('/api/search', cors, search);
app.get('/api/topcharts', cors, topCharts);
app.use(express.static('./build'));
app.get('*', (req, res) => res.send(indexFile));

if (!process.env.SERVER_PORT) {
  throw new Error('Rename env file to .env and enter your credentials');
}

app.listen(process.env.SERVER_PORT, () => console.log(`Ready on ${process.env.SERVER_PORT}`));
