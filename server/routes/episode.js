const rss2json = require('rss-to-json');
const cache = require('../libs/cache');
const fetch = require('../libs/fetch');

module.exports = async (req, res) => {
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
