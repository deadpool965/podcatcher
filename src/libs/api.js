export default (url) => {
  const parsedUrl = /localhost/.test(window.location.hostname)
    ? `http://localhost:3001/api/${url}`
    : `/api/${url}`;
  return fetch(parsedUrl);
};
