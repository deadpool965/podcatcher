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
    const oReq = new XMLHttpRequest();
    oReq.responseType = 'blob';

    const offlineEpisode = {
      episode,
      podcast,
      url,
      progress: 0,
      blob: null,
      createTime: new Date() - 1,
      request: oReq,
    };

    dispatchOfflineEpisodes({
      type: OFFLINE_EPISODES_ACTION_TYPE.ADD,
      payload: offlineEpisode,
    });

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

      // Delete request before syncing to
      // database. Database cannot store
      // request. (obviously)
      delete offlineEpisode.request;
      dispatchOfflineEpisodes({
        type: OFFLINE_EPISODES_ACTION_TYPE.SYNC_WITH_DATABASE,
      });
    }, false);

    oReq.addEventListener('error', (evt) => {
      dispatchOfflineEpisodes({
        type: OFFLINE_EPISODES_ACTION_TYPE.REMOVE,
        payload: offlineEpisode,
      });
    }, false);

    oReq.addEventListener('abort', () => {
      dispatchOfflineEpisodes({
        type: OFFLINE_EPISODES_ACTION_TYPE.REMOVE,
        payload: offlineEpisode,
      });
    }, false);

    oReq.open('get', `${BASE_URL}proxy?url=${encodeURI(url)}`);
    oReq.send();
    setShowOptionsDialog(false);
  }

  function remove() {
    if (!downloaded) return;
    dispatchOfflineEpisodes({
      type: OFFLINE_EPISODES_ACTION_TYPE.REMOVE,
      payload: downloaded,
    });
    dispatchOfflineEpisodes({
      type: OFFLINE_EPISODES_ACTION_TYPE.SYNC_WITH_DATABASE,
    });
    setShowOptionsDialog(false);
  }

  function abort() {
    if (!downloaded || !downloaded.request) return;
    downloaded.request.abort();
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
          {downloaded && downloaded.blob
            ? (
              <Button
                onClick={remove}
              >
                <i
                  aria-hidden
                  className="icon ion-md-trash"
                  style={{ marginRight: '8px' }}
                />
                Delete Download
              </Button>
            )
            : null}
          {downloaded && !downloaded.blob
            ? (
              <Button onClick={abort}>
                {`(${downloaded.progress}%) Cancel Download`}
              </Button>
            )
            : null}
          {!downloaded
            ? (
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
            )
            : null}
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
              {
                downloaded
                && !downloaded.blob
                  ? `Downloading... ${downloaded.progress}%`
                  : null
              }
              {
                downloaded
                && downloaded.blob
                  ? 'Downloaded'
                  : null
              }
              {
                !downloaded
                  ? (new Date(created)).toGMTString().substr(0, 16)
                  : null
              }
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
