module.exports = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https'
    && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.headers.host}${req.url}`);
    return;
  }

  next();
};
