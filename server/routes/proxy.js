const request = require('request');

module.exports = (req, res) => {
  const { url } = req.query;
  if (!url) {
    res
      .status(400)
      .send('Query parameter \'url\' missing');
    return;
  }

  request(url)
    .pipe(res);
};
