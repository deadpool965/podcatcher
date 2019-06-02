const fetch = require('../libs/fetch');

module.exports = async (req, res) => {
  try {
    const searchParams = `${Object
      .keys(req.query)
      .map(k => `${k}=${encodeURI(req.query[k])}`)
      .join('&')}`;
    const data = await fetch(`https://itunes.apple.com/search?${searchParams}`);
    res.send(data);
  } catch (e) {
    res
      .status(500)
      .send(e);
  }
};
