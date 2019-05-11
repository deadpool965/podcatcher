import axios from 'axios';

export const getTopCharts = async ({
  country = 'us',
  limit = 25,
}) => {
  const { data } = await axios(`https://rss.itunes.apple.com/api/v1/${country}/podcasts/top-podcasts/all/${limit}/explicit.json`);
  return data.feed.results;
};

