import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import langParser from 'accept-language-parser';
import { getTopCharts } from '../libs/itunes';
import Application from '../components/Application';
import TextInput from '../components/TextInput';
import PodcastLinkGrid from '../components/PodcastLinkGrid';

function Index({ router, topChartsPodcasts }) {
  const [q, setQ] = useState(router.query.q || '');
  const form = useRef();
  const title = q
    ? `Results for "${q}"`
    : 'PodCatcher';

  function handleSubmit(e) {
    e.preventDefault();
    const { value: query } = form.current.q;
    setQ(query);
    window
      .history
      .pushState({}, title, `/?q=${encodeURI(query)}`);
  }

  return (
    <Application
      title={title}
    >
      <form
        onSubmit={handleSubmit}
        ref={form}
      >
        <TextInput
          name="q"
          placeholder="Search"
          icon="search"
          ariaLabel="Search"
          defaultValue={q}
        />
      </form>
      <h2>Popular Podcasts</h2>
      <PodcastLinkGrid
        podcasts={topChartsPodcasts}
      />
    </Application>
  );
}

Index.getInitialProps = async ({ req }) => {
  try {
    const acceptLanguage = req.headers['accept-language'] || 'en-US,en;q=0.8';
    const country = langParser.parse(acceptLanguage)[0].region.toLowerCase();
    const topChartsPodcasts = await getTopCharts({ country, limit: 30 });
    return { topChartsPodcasts };
  } catch (e) {
    return {
      topChartsPodcasts: [],
    };
  }
};

Index.propTypes = {
  router: PropTypes.shape({
    query: PropTypes.shape({
      q: PropTypes.string,
    }),
  }).isRequired,
  topChartsPodcasts: PropTypes.arrayOf(
    PropTypes.shape({
      artistName: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
      artistId: PropTypes.string,
      artworkUrl100: PropTypes.string,
    }),
  ),
};

Index.defaultProps = {
  topChartsPodcasts: [],
};

export default withRouter(Index);
