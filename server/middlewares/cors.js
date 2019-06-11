module.exports = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production'
    ? 'https://podcatcher.app'
    : '*');
  next();
};
