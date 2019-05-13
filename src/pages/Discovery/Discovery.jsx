import React, { useState, useRef, useEffect } from 'react';
import TextInput from '../../components/TextInput/TextInput';
import PodcastLinkGrid from '../../components/PodcastLinkGrid/PodcastLinkGrid';
import SelectInput from '../../components/SelectInput/SelectInput';
import CATEGORIES from '../../libs/categories';
import COUNTRIES from '../../libs/countries';
import MY_CONTRY from '../../libs/myCountry';
import './Discovery.css';
import Button from '../../components/Button/Button';

function Discovery() {
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

  function generatePodcastPlaceholders(number) {
    const genPodcasts = [];
    for (let i = 0; i < number; i += 1) {
      genPodcasts.push({
        id: `${Math.random()}`,
        name: '',
        artworkUrl100: '',
        placeholder: true,
      });
    }
    return genPodcasts;
  }
  const [topChartsPodcasts, setTopChartsPodcasts] = useState(generatePodcastPlaceholders(30));

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}topcharts?limit=30&country=${MY_CONTRY}`)
      .then(result => result.json())
      .then(data => setTopChartsPodcasts(data));
  }, []);

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
        <div className="discovery-page__inner-form">
          <div className="discovery-page__inner-form__field-wrapper">
            <SelectInput
              name="category"
              placeholder="All Categories"
              ariaLabel="Search"
              options={[
                {
                  label: 'All Categories',
                  value: '',
                },
                ...CATEGORIES,
              ]}
            />
            <SelectInput
              name="country"
              placeholder="All Countries"
              ariaLabel="Search"
              defaultValue={MY_CONTRY}
              options={COUNTRIES}
            />
          </div>
          <div>
            <Button fullWidth>
              <i className="icon ion-md-search" style={{ marginRight: '8px' }} />
              Search
            </Button>
          </div>
        </div>
      </form>
      <h2>Popular Podcasts</h2>
      <PodcastLinkGrid
        podcasts={topChartsPodcasts}
      />
    </div>
  );
}

export default Discovery;
