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

  const userIP = req.ip;
  const headers = Object
    .keys(req.headers)
    .filter(key => key !== 'host')
    .reduce((prev, key) => {
      const hds = prev;
      hds[key] = req.headers[key];
      return hds;
    }, {});
  headers['X-Real-IP'] = userIP;
  headers['X-Forwarded-For'] = userIP;
  headers.Forwarded = `for="${userIP}"`;

  request({
    url,
    headers,
  })
    .on('error', () => {
      res
        .status(404)
        .send('Invalid URL');
    })
    .pipe(res);
};
