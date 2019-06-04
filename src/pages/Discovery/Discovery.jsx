import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextInput from '../../components/TextInput/TextInput';
import PodcastGrid from '../../components/PodcastGrid/PodcastGrid';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';
import Metadata from '../../components/Metadata/Metadata';
import MY_CONTRY from '../../libs/myCountry';
import countries from '../../libs/countries';
import queryParser from '../../libs/queryParser';
import api from '../../libs/api';
import './Discovery.css';


function PodcastResults({ searchResults }) {
  if (searchResults === null) {
    return <Spinner />;
  }

  if (searchResults.length === 0) {
    return <span>No results found.</span>;
  }

  return (
    <PodcastGrid
      podcasts={searchResults}
    />
  );
}

PodcastResults.propTypes = {
  searchResults: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      artworkUrl100: PropTypes.string,
    }),
  ),
};

PodcastResults.defaultProps = {
  searchResults: null,
};

function Discovery({ history, location }) {
  const query = queryParser(location.search);
  const [q, setQ] = useState(query.q || '');
  const [searchResults, setSearchResults] = useState([]);
  const [countryName, setCountryName] = useState(null);

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
    api(`topcharts?limit=30&country=${query.country || MY_CONTRY}`)
      .then(result => result.json())
      .then(data => setTopChartsPodcasts(data));

    const code = query.country || MY_CONTRY;
    const country = countries
      .find(c => c.value === code);
    if (country) {
      setCountryName(country.label);
    }
  }, [query.country]);

  useEffect(() => {
    if (!query.q) return;
    setSearchResults(null);
    api(`search?term=${query.q}&limit=30&media=podcast`)
      .then(result => result.json())
      .then((data) => {
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
      <Metadata
        title={`PodCatcher ${countryName ? ` (${countryName})` : ''}`}
        description="PodCatcher is a free podcast player for the web. Listen to podcasts on or phone or desktop."
      />
      <form
        onSubmit={handleSubmit}
        className="discovery-page__form"
        aria-label="Search podcasts"
      >
        <TextInput
          name="q"
          placeholder="Search"
          ariaLabel="Search by name"
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
          <div>
            <h2 className="discovery-page__title">
              {`Results for "${query.q}"`}
            </h2>
            {
              <PodcastResults
                searchResults={searchResults}
              />
            }
          </div>
        )
        : (
          <div>
            <h2 className="discovery-page__title">
              {`Popular Podcasts in ${countryName}`}
            </h2>
            <PodcastGrid
              podcasts={topChartsPodcasts}
            />
          </div>
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
