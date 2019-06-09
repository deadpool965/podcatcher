const express = require('express');
const compression = require('compression');
const zlib = require('zlib');
const { readFileSync } = require('fs');
const cors = require('./server/middlewares/cors');
const https = require('./server/middlewares/https');

const app = express();
app.use(
  compression(
    {
      level: zlib.Z_BEST_COMPRESSION,
    },
  ),
);
app.use(cors);
app.use(https);

const indexFile = (() => readFileSync('./build/index.html', { encoding: 'utf-8' }))();

const sw = require('./server/routes/sw');
const find = require('./server/routes/find');
const episode = require('./server/routes/episode');
const search = require('./server/routes/search');
const topCharts = require('./server/routes/topCharts');
const sitemap = require('./server/routes/sitemap');

app.get('/robots.txt', (req, res) => res.status(404).end());
app.get('/sitemap.xml', sitemap);
app.get('/sw.js', sw);
app.get('/api/podcast/:id', find);
app.get('/api/episodes/:id', episode);
app.get('/api/search', search);
app.get('/api/topcharts', topCharts);
app.use(express.static('./build'));
app.get('*', (req, res) => res.send(indexFile));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Ready on ${PORT}`));
