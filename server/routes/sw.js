const {
  readFileSync,
  readdirSync,
  lstatSync,
  statSync,
} = require('fs');

module.exports = (req, res) => {
  function getFiles(path) {
    const files = [];
    const folders = [];

    readdirSync(path)
      .forEach((item) => {
        const ignore = ['sw.js', 'splashscreens'];
        if (ignore.indexOf(item) !== -1) return;

        const fullPath = `${path}/${item}`;
        if (lstatSync(fullPath).isDirectory()) {
          folders.push(fullPath);
          return;
        }

        files.push(fullPath);
      });

    folders
      .forEach((folder) => {
        getFiles(folder)
          .forEach((file) => {
            files.push(file);
          });
      });

    return files
      .map(f => f.replace('./build', ''));
  }
  const buildFiles = getFiles('./build');
  const bundleFile = buildFiles
    .find(f => /main\..+\.js$/.test(f));
  const bundleAge = statSync(`./build${bundleFile}`).mtime;

  let sw = readFileSync('./build/sw.js', { encoding: 'utf-8' });
  sw = sw
    .replace('const buildFiles = [];', `const buildFiles = ${JSON.stringify(buildFiles)};`)
    .replace('const CACHE_NAME = \'CACHE_NAME\';', `const CACHE_NAME = '${bundleAge}';`);

  res.setHeader('Content-Type', 'application/javascript');
  res.send(sw);
};
