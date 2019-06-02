const axios = require('axios');
const cache = require('./cache');

module.exports = async (url) => {
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
