const { createServer } = require('http');
const { parse } = require('url');
const axios = require('axios');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer(async (req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      if (['/search', '/lookup'].indexOf(pathname) !== -1) {
        const URL = 'https://itunes.apple.com';
        const args = Object
          .keys(query)
          .map(key => `${key}=${encodeURI(query[key])}`)
          .join('&');
        const { data } = await axios(`${URL}${pathname}?${args}`);
        res.setHeader('Content-type', 'application/json');
        res.end(JSON.stringify(data));
      } else {
        handle(req, res, parsedUrl);
      }
    }).listen(3000);
  });
