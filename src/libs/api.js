import localForage from 'localforage';

export default url => new Promise((resolve, reject) => {
  const parsedUrl = /localhost/.test(window.location.hostname)
    ? `http://localhost:3001/api/${url}`
    : `/api/${url}`;

  fetch(parsedUrl)
    .then(res => res.json())
    .then((res) => {
      resolve(res);
      localForage
        .setItem(parsedUrl, res);
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
