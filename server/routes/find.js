const fetch = require('../libs/fetch');

module.exports = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await fetch(`https://itunes.apple.com/lookup?id=${id}`);
    res.send(data.results[0]);
  } catch (e) {
    res
      .status(500)
      .send(e);
  }
};
