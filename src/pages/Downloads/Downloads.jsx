import React, { useContext } from 'react';
import Episode from '../../components/Episode/Episode';
import { OfflineEpisodesContext } from '../../libs/Store';
import './Downloads.css';

function Downloads() {
  const [offlineEpisodes] = useContext(OfflineEpisodesContext);

  if (offlineEpisodes.length === 0) {
    return (
      <div className="subscriptions-page__empty">
        <div>
          <i
            className="icon ion-md-sad"
          />
        </div>
        <div>
          No downloaded episodes found
        </div>
      </div>
    );
  }

  return (
    <div className="downloads-page">
      {offlineEpisodes
        .map(({
          episode,
          podcast,
          url,
        }) => (
          <Episode
            key={url}
            episode={episode}
            podcast={podcast}
            showPodcastName
            noDescription
          />
        ))}
    </div>
  );
}

export default Downloads;
