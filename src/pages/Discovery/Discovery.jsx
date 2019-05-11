import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import TextInput from '../../components/TextInput/TextInput';
import PodcastLinkGrid from '../../components/PodcastLinkGrid/PodcastLinkGrid';

function Discovery({ topChartsPodcasts }) {
  const [q, setQ] = useState('');
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
    <div className="discovery-page">
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
    </div>
  );
}

Discovery.propTypes = {
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

Discovery.defaultProps = {
  topChartsPodcasts: [],
};

export default Discovery;
