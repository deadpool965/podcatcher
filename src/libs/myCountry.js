function myCountry() {
  const { language: browserLanguage } = navigator;
  let country = 'us';

  if (/\S{2}-\S{2}/.test(browserLanguage)) {
    country = browserLanguage
      .split('-')[1]
      .toLocaleLowerCase();
  }

  return country;
}

export default myCountry();
