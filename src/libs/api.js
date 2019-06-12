import localForage from 'localforage';

export const BASE_URL = /localhost/.test(window.location.hostname)
  ? 'http://localhost:3001/api/'
  : '/api/';

export default (url, options = { cache: true }) => new Promise((resolve, reject) => {
  const parsedUrl = `${BASE_URL}${url}`;

  fetch(parsedUrl)
    .then(res => res.json())
    .then((res) => {
      resolve(res);
      if (options.cache) {
        localForage
          .setItem(parsedUrl, res);
      }
    })
    .catch((e) => {
      localForage
        .getItem(parsedUrl, (err, cache) => {
          if (err || !cache) {
            reject(e);
            return;
          }

          resolve(cache);
        });
    });
});
