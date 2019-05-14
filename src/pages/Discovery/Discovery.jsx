import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextInput from '../../components/TextInput/TextInput';
import PodcastLinkGrid from '../../components/PodcastLinkGrid/PodcastLinkGrid';
import MY_CONTRY from '../../libs/myCountry';
import queryParser from '../../libs/queryParser';
import './Discovery.css';
import Button from '../../components/Button/Button';

function Discovery({ history, location }) {
  const query = queryParser(location.search);
  const [q, setQ] = useState(query.q || '');
  const [searchResults, setSearchResults] = useState([]);

  function handleChange({ target }) {
    setQ(target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSearchResults([]);
    history.push(`/?q=${q}`);
  }

  function resetForm() {
    setQ('');
    setSearchResults([]);
    history.push('/');
  }

  function generatePodcastPlaceholders(number) {
    const genPodcasts = [];
    for (let i = 0; i < number; i += 1) {
      genPodcasts.push({
        id: `${Math.random()}`,
        name: '',
        artworkUrl100: '',
      });
    }
    return genPodcasts;
  }

  const [topChartsPodcasts, setTopChartsPodcasts] = useState(generatePodcastPlaceholders(30));
  useEffect(() => {
    if (query.q) return;
    fetch(`${process.env.REACT_APP_API}topcharts?limit=30&country=${MY_CONTRY}`)
      .then(result => result.json())
      .then(data => setTopChartsPodcasts(data));
  });

  useEffect(() => {
    if (!query.q) return;
    fetch(`${process.env.REACT_APP_API}search?term=${query.q}&limit=30&media=podcast`)
      .then(result => result.json())
      .then((data) => {
        setSearchResults([]);
        setSearchResults(
          data
            .results
            .map((r) => {
              const podcast = {
                id: `${r.collectionId}`,
                name: r.collectionName,
                artworkUrl100: r.artworkUrl100,
              };
              return podcast;
            }),
        );
      });
  }, [query.q]);

  return (
    <div className="discovery-page">
      <form
        onSubmit={handleSubmit}
        className="discovery-page__form"
      >
        <TextInput
          name="q"
          placeholder="Search"
          ariaLabel="Search"
          defaultValue={q}
          onChange={handleChange}
          clearButton
          onClear={resetForm}
        />
        <Button
          fullWidth
          onClick={handleSubmit}
          ariaLabel="Search"
        >
          <i
            className="icon ion-md-search"
            aria-hidden
          />
        </Button>
      </form>
      {query.q
        ? (
          <Fragment>
            <h2>
              {`Results for "${query.q}"`}
            </h2>
            <PodcastLinkGrid
              podcasts={searchResults}
            />
          </Fragment>
        )
        : (
          <Fragment>
            <h2>Popular Podcasts</h2>
            <PodcastLinkGrid
              podcasts={topChartsPodcasts}
            />
          </Fragment>
        )}
    </div>
  );
}

Discovery.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default Discovery;
