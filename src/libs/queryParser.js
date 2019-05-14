export default function (query) {
  if (/^\?\S+=\S+/.test(query) === false) {
    return {};
  }

  return query
    .substring(1)
    .split('&')
    .reduce((prev, curr) => {
      const obj = prev;
      const [key, value] = curr.split('=');
      obj[key] = decodeURI(value);
      return obj;
    }, {});
}
