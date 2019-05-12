import React, { useState, useRef, useEffect } from 'react';
import TextInput from '../../components/TextInput/TextInput';
import PodcastLinkGrid from '../../components/PodcastLinkGrid/PodcastLinkGrid';

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
  const [topChartsPodcasts, setTopChartsPodcasts] = useState(generatePodcastPlaceholders(50));

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}topcharts`)
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
      </form>
      <h2>Popular Podcasts</h2>
      <PodcastLinkGrid
        podcasts={topChartsPodcasts}
      />
    </div>
  );
}

export default Discovery;
