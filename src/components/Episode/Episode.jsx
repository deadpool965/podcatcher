import React from 'react';
import PropTypes from 'prop-types';
import Grid from '../Grid/Grid';
import PlayButton from '../PlayButton/PlayButton';
import EpisodeDescription from '../EpisodeDescription/EpisodeDescription';
import './Episode.css';

function Episode({ episode }) {
  const {
    title,
    created,
    description,
  } = episode;

  return (
    <div className="episode">
      <Grid rows="auto auto">
        <Grid columns="35px auto">
          <div className="episode__play">
            <PlayButton episode={episode} />
          </div>
          <div>
            <div
              className="episode__release-date"
              aria-label="Release date"
            >
              {(new Date(created)).toGMTString()}
            </div>
            <h3 className="episode__title">
              {title}
            </h3>
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
};

export default Episode;
