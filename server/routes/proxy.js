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

  request(url)
    .on('error', () => {
      res
        .status(404)
        .send('Invalid URL');
    })
    .pipe(res);
};
