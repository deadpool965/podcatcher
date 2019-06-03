import React, {
  Fragment,
  useEffect,
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import './EpisodeDescription.css';

function EpisodeDescription({
  text,
}) {
  const [overflow, setOverflow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const wrapper = useRef();

  useEffect(() => {
    const { clientHeight } = wrapper.current;
    setOverflow(clientHeight > 100);
  }, []);

  function expand() {
    setExpanded(true);
    wrapper.current.focus();
  }

  return (
    <div
      className={`episode-description ${
        expanded
          ? 'episode-description--expanded'
          : ''
      }`}
    >
      <div
        ref={wrapper}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      {overflow && expanded === false
        ? (
          <Fragment>
            <div
              className="episode-description__shade"
              aria-hidden
            />
            <button
              type="button"
              className="episode-description__read-more-btn"
              onClick={expand}
              aria-hidden
            >
              Read More
            </button>
          </Fragment>
        )
        : null}
    </div>
  );
}

EpisodeDescription.propTypes = {
  text: PropTypes.string.isRequired,
};

export default EpisodeDescription;
