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
import strings from '../../libs/language';
import './Episode.css';

function Episode({
  episode,
  podcast,
  showPodcastName,
  noDescription,
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
      dispatchOfflineEpisodes({
        type: OFFLINE_EPISODES_ACTION_TYPE.SYNC_WITH_DATABASE,
      });
    }, false);

    oReq.addEventListener('error', () => {
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
    if (!downloaded) return;
    if (downloaded.request && downloaded.request.abort) {
      downloaded.request.abort();
    }
    dispatchOfflineEpisodes({
      type: OFFLINE_EPISODES_ACTION_TYPE.REMOVE,
      payload: downloaded,
    });
    dispatchOfflineEpisodes({
      type: OFFLINE_EPISODES_ACTION_TYPE.SYNC_WITH_DATABASE,
    });
    setShowOptionsDialog(false);
  }

  return (
    <div className={`episode ${downloaded && downloaded.blob ? 'episode--downloaded' : ''}`}>
      <Modal
        title={strings.options}
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
                {strings.deleteDownload}
              </Button>
            )
            : null}
          {downloaded && !downloaded.blob
            ? (
              <Button onClick={abort}>
                {strings.formatString(strings.cancelDownload, downloaded.progress)}
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
                {strings.download}
              </Button>
            )
            : null}
        </Grid>
      </Modal>
      <Grid rows={`auto ${noDescription ? '' : 'auto'}`}>
        <Grid columns={`35px auto ${downloaded || window.isMobile === false ? 'min-content' : ''}`}>
          <div className="episode__play">
            {(downloaded && downloaded.blob) || (!window.isMobile && !downloaded)
              ? (
                <PlayButton
                  episode={episode}
                  podcast={podcast}
                />
              )
              : (
                <Button
                  transparent
                  circle
                  accentText
                  border
                  onClick={() => {
                    if (downloaded) return;
                    download();
                  }}
                  ariaLabel={strings.download}
                >
                  {downloaded
                    ? (
                      <span style={{ fontSize: 12 }}>
                        {`${downloaded.progress}%`}
                      </span>
                    )
                    : (
                      <i
                        className="icon ion-md-cloud-download"
                        aria-hidden
                      />
                    )}
                </Button>
              )}
          </div>
          <div>
            <div
              className="episode__release-date"
            >
              {
                (showPodcastName
                && downloaded
                && downloaded.blob)
                || (showPodcastName
                && !downloaded)
                  ? podcast.collectionName
                  : null
              }
              {
                !showPodcastName
                && downloaded
                && downloaded.blob
                  ? strings.downloaded
                  : null
              }
              {
                (
                  !showPodcastName
                  && !downloaded
                )
                || (
                  !showPodcastName
                  && downloaded
                  && !downloaded.blob
                )
                  ? (new Date(created)).toGMTString().substr(0, 16)
                  : null
              }
            </div>
            <h3 className="episode__title">
              {title}
            </h3>
          </div>
          {downloaded || !window.isMobile
            ? (
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
            ) : null}
        </Grid>
        {noDescription
          ? null
          : (
            <EpisodeDescription
              text={description}
            />
          )}
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
    collectionName: PropTypes.string,
    artworkUrl30: PropTypes.string,
    artworkUrl60: PropTypes.string,
    artworkUrl100: PropTypes.string,
    artworkUrl600: PropTypes.string,
  }).isRequired,
  showPodcastName: PropTypes.bool,
  noDescription: PropTypes.bool,
};

Episode.defaultProps = {
  showPodcastName: false,
  noDescription: false,
};

export default Episode;
