import React, {
  Fragment,
  useEffect,
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import linkifyHtml from 'linkifyjs/html';
import strings from '../../libs/language';
import './EpisodeDescription.css';

function EpisodeDescription({
  text,
}) {
  const [overflow, setOverflow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const wrapper = useRef();

  useEffect(() => {
    const $wrapper = wrapper.current;
    const $content = document.createElement('div');

    const formattedText = linkifyHtml(
      text
        .replace(/<script(\s|\S)*?<\/script>/gi, '')
        .replace(/<style(\s|\S)*?<\/style>/gi, '')
        .replace(/style="(\s|\S)*?"/gi, '')
        .replace(/style='(\s|\S)*?'/gi, '')
        .replace(/<img(\s|\S)*?\/>/gi, '')
        .replace(/<!--(\s|\S)*?-->/gi, ''),
    );

    $content.innerHTML = formattedText;
    $wrapper.appendChild($content);
    setOverflow($content.clientHeight > 100);
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
              {strings.readMore}
            </button>
          </Fragment>
        )
        : null}
      <div ref={wrapper} />
    </div>
  );
}

EpisodeDescription.propTypes = {
  text: PropTypes.string.isRequired,
};

export default EpisodeDescription;
