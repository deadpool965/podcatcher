const fetch = require('../libs/fetch');

module.exports = async (req, res) => {
  try {
    const country = req.query.country || 'us';
    const limit = req.query.limit || 50;
    const data = await fetch(`https://rss.itunes.apple.com/api/v1/${country}/podcasts/top-podcasts/all/${limit}/explicit.json`);
    res.send(data.feed.results);
  } catch (e) {
    res
      .status(500)
      .send(e);
  }
};
