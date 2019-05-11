const express = require('express');
const app = express();
const PORT = process.env.ENVIROMENT === 'production' ?
  80 : 3001;

const indexFile = (() => {
  const { readFileSync } = require('fs');
  return readFileSync('./build/index.html', { encoding: 'utf-8' });
})();

const lookup = (req, res) => res.send('lookup');
const search = (req, res) => res.send('search');
const topCharts = (req, res) => res.send('topCharts');

app.get('/api/lookup', lookup);
app.get('/api/search', search);
app.get('/api/topcharts', topCharts);
app.use(express.static('./build'));
app.get('*', (req, res) => res.send(indexFile));

app.listen(PORT, () => console.log(`Ready on ${PORT}`));
