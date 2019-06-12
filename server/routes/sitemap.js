const fetch = require('../libs/fetch');

// We could simply import all countries. Such as this:
// const countries = require('../libs/countries');
// However, it seems to be a bit too much for google.
// So we are going to select a few countries, and
// expand the list in a later date.
const countries = ['us', 'br', 'gb'];

const getTopChartIds = async (ids = [], index = 0) => {
  const country = countries[index];
  if (!country) return ids;
  try {
    const topCharts = await fetch(`https://rss.itunes.apple.com/api/v1/${country}/podcasts/top-podcasts/all/30/explicit.json`);
    topCharts
      .feed
      .results
      .forEach(p => ids.push(p.id));
    const result = await getTopChartIds(ids, index + 1);
    return result;
  } catch (e) {
    return ids;
  }
};

module.exports = async (req, res) => {
  const ids = await getTopChartIds();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://podcatcher.app/</loc>
      <changefreq>weekly</changefreq>
      <priority>1</priority>
    </url>
    ${countries
    .map(c => `
      <url>
        <loc>https://podcatcher.app/?country=${c}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
      </url>`)
    .join('\n')}
    ${ids
    .map(id => `<url>
      <loc>https://podcatcher.app/${id}/</loc>
      <changefreq>weekly</changefreq>
      <priority>1</priority>
    </url>`)
    .join('\n')}
  </urlset> 
  `;
  res
    .set('Content-Type', 'application/xml')
    .set('charset', 'utf-8')
    .send(xml);
};
