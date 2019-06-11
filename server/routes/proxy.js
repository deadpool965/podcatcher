const request = require('request');
const { parse } = require('url');

module.exports = (req, res) => {
  const { url } = req.query;

  if (!url || !parse(url).hostname) {
    res
      .status(400)
      .send('Query parameter \'url\' missing or invalid');
    return;
  }

  request({
    url,
    headers: Object
      .keys(req.headers)
      .filter(key => key !== 'host')
      .reduce((prev, key) => {
        const headers = prev;
        headers[key] = req.headers[key];
        return headers;
      }, {}),
  })
    .on('error', () => {
      res
        .status(404)
        .send('Invalid URL');
    })
    .pipe(res);
};
