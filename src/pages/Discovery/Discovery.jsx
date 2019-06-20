import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import TextInput from '../../components/TextInput/TextInput';
import PodcastGrid from '../../components/PodcastGrid/PodcastGrid';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';
import Metadata from '../../components/Metadata/Metadata';
import OfflineAlert from '../../components/OfflineAlert/OfflineAlert';
import MY_CONTRY from '../../libs/myCountry';
import countries from '../../libs/countries';
import queryParser from '../../libs/queryParser';
import api from '../../libs/api';
import strings from '../../libs/language';
import './Discovery.css';


function PodcastResults({ searchResults }) {
  if (searchResults === null) {
    return <Spinner />;
  }

  if (searchResults.length === 0) {
    return <span>{strings.noResultsFound}</span>;
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
  const [topChartsOffline, setTopChartsOffline] = useState(false);
  useEffect(() => {
    api(`topcharts?limit=30&country=${query.country || MY_CONTRY}`)
      .then(data => setTopChartsPodcasts(data))
      .catch(() => setTopChartsOffline(true));

    const code = query.country || MY_CONTRY;
    const country = countries
      .find(c => c.value === code);
    if (country) {
      setCountryName(country.label);
    }
  }, [query.country]);

  const [searchResultsOffline, setSearchResultsOffline] = useState(false);
  useEffect(() => {
    if (!query.q) return;
    setSearchResults(null);
    setSearchResultsOffline(false);
    api(`search?term=${query.q}&limit=30&media=podcast`)
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
      })
      .catch(() => setSearchResultsOffline(true));
  }, [query.q]);

  return (
    <div className="discovery-page">
      <Metadata
        title={`PodCatcher ${countryName ? ` (${countryName})` : ''}`}
        description={strings.metaDescription}
      />
      <form
        onSubmit={handleSubmit}
        className="discovery-page__form"
        aria-label={strings.searchPodcasts}
      >
        <TextInput
          name="q"
          placeholder={strings.search}
          ariaLabel={strings.searchByName}
          defaultValue={q}
          onChange={handleChange}
          clearButton
          onClear={resetForm}
        />
        <Button
          fullWidth
          onClick={handleSubmit}
          ariaLabel={strings.search}
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
            {searchResultsOffline
              ? <OfflineAlert />
              : (
                <Fragment>
                  <h2 className="discovery-page__title">
                    {strings.formatString(strings.resultsForX, query.q)}
                  </h2>
                  {
                    <PodcastResults
                      searchResults={searchResults}
                    />
                  }
                </Fragment>
              )}
          </div>
        )
        : (
          <div>
            {topChartsOffline
              ? <OfflineAlert />
              : (
                <Fragment>
                  <h2 className="discovery-page__title">
                    {strings.formatString(strings.popularPodcastsInX, countryName || '')}
                  </h2>
                  <PodcastGrid
                    podcasts={topChartsPodcasts}
                  />
                </Fragment>
              )}
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
