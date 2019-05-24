import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Grid from '../Grid/Grid';
import MiniPlayButton from '../MiniPlayButton/MiniPlayButton';
import EpisodeDescription from '../EpisodeDescription/EpisodeDescription';
import './Episode.css';

function Episode({ episode }) {
  const {
    title,
    created,
    description,
  } = episode;

  const [visible, setVisible] = useState(false);
  const wrapper = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries
        .forEach(({
          intersectionRatio,
          target,
        }) => {
          if (intersectionRatio > 0) {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setVisible(true);
              });
            });
            observer.unobserve(target);
          }
        });
    }, {
      threshold: 0.001,
    });
    observer.observe(wrapper.current);
  }, []);

  return (
    <div
      className={`episode ${visible ? 'episode--visible' : 'episode--placeholder'}`}
      ref={wrapper}
    >
      {visible
        ? (
          <Grid rows="auto auto">
            <Grid columns="35px auto">
              <div className="episode__play">
                <MiniPlayButton episode={episode} />
              </div>
              <div>
                <div className="episode__release-date">
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
        )
        : null}
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
