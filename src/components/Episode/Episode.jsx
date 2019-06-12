import React, {
  useState,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import Grid from '../Grid/Grid';
import PlayButton from '../PlayButton/PlayButton';
import EpisodeDescription from '../EpisodeDescription/EpisodeDescription';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import {
  OfflineEpisodesContext,
  OFFLINE_EPISODES_ACTION_TYPE,
} from '../../libs/Store';
import { BASE_URL } from '../../libs/api';
import './Episode.css';

function Episode({
  episode,
  podcast,
}) {
  const {
    title,
    created,
    description,
  } = episode;
  const { url } = episode.enclosures[0];
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const [offlineEpisodes, dispatchOfflineEpisodes] = useContext(OfflineEpisodesContext);
  const downloaded = offlineEpisodes
    .find(ep => ep.url === url);

  function download() {
    const offlineEpisode = {
      episode,
      podcast,
      url,
      progress: 0,
      blob: null,
      createTime: (new Date()).toString(),
    };

    dispatchOfflineEpisodes({
      type: OFFLINE_EPISODES_ACTION_TYPE.ADD,
      payload: offlineEpisode,
    });

    const oReq = new XMLHttpRequest();
    oReq.responseType = 'blob';

    oReq.addEventListener('progress', ({
      loaded,
      total,
    }) => {
      const pct = Math.floor((loaded / total) * 100);
      offlineEpisode.progress = pct;
      dispatchOfflineEpisodes({
        type: OFFLINE_EPISODES_ACTION_TYPE.UPDATE,
        payload: offlineEpisode,
      });
    }, false);

    oReq.addEventListener('load', () => {
      offlineEpisode.blob = oReq.response;
      dispatchOfflineEpisodes({
        type: OFFLINE_EPISODES_ACTION_TYPE.UPDATE,
        payload: offlineEpisode,
      });
      dispatchOfflineEpisodes({
        type: OFFLINE_EPISODES_ACTION_TYPE.SYNC_WITH_DATABASE,
      });
    }, false);

    oReq.addEventListener('error', (evt) => {
      console.log('error', evt, oReq); 
    }, false);

    oReq.addEventListener('abort', () => {
      console.log('abort');
    }, false);

    oReq.open('get', `${BASE_URL}proxy?url=${encodeURI(url)}`);
    oReq.send();
    setShowOptionsDialog(false);
  }

  return (
    <div className={`episode ${downloaded && downloaded.blob ? 'episode--downloaded' : ''}`}>
      <Modal
        title="Options"
        open={showOptionsDialog}
        onClose={() => setShowOptionsDialog(false)}
      >
        <Grid>
          <Button
            onClick={download}
          >
            <i
              aria-hidden
              className="icon ion-md-cloud-download"
              style={{ marginRight: '8px' }}
            />
            Download
          </Button>
        </Grid>
      </Modal>
      <Grid rows="auto auto">
        <Grid columns="35px auto min-content">
          <div className="episode__play">
            <PlayButton episode={episode} />
          </div>
          <div>
            <div
              className="episode__release-date"
            >
              {(new Date(created)).toGMTString()}
            </div>
            <h3 className="episode__title">
              {title}
            </h3>
          </div>
          <div className="episode__play">
            <Button
              ariaLabel="More"
              transparent
              small
              accentText
              circle
              onClick={() => setShowOptionsDialog(true)}
            >
              <i
                aria-hidden
                className="icon ion-md-more"
              />
            </Button>
          </div>
        </Grid>
        <EpisodeDescription
          text={description}
        />
      </Grid>
    </div>
  );
}

Episode.propTypes = {
  episode: PropTypes.shape({
    title: PropTypes.string,
    created: PropTypes.number,
    description: PropTypes.string,
  }).isRequired,
  podcast: PropTypes.shape({
    artistName: PropTypes.string,
    collectionId: PropTypes.number,
    artworkUrl100: PropTypes.string,
  }).isRequired,
};

export default Episode;
