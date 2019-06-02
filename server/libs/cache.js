const {
  readFileSync,
  writeFileSync,
  statSync,
  existsSync,
} = require('fs');

const cache = {
  path: key => `./cache/${key.replace(/[^a-zA-Z0-9]/gi, '_')}.cache`,
  set: (key, value) => {
    writeFileSync(cache.path(key), JSON.stringify(value), { encoding: 'utf-8' });
  },
  get: (key) => {
    try {
      const data = JSON.parse(readFileSync(cache.path(key), { encoding: 'utf-8' }));
      return data;
    } catch (e) {
      return false;
    }
  },
  expired: (key) => {
    const path = cache.path(key);
    if (!existsSync(path)) return false;
    const { mtime } = statSync(path);
    const exp = new Date(mtime);
    const now = new Date();
    const dif = (now - exp) / 1000;
    return dif > 60 * 60 * 6;
  },
};

module.exports = cache;
