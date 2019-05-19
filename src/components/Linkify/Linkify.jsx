import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import ReactLinkify from 'react-linkify';

const observer = new IntersectionObserver((entries) => {
  entries
    .forEach(({
      target,
      intersectionRatio,
    }) => {
      const parsed = target.getAttribute('parsed');
      if (intersectionRatio === 0 || parsed) return;
      target.setAttribute('parsed', 1);
      requestAnimationFrame(() => {
        render(<ReactLinkify>{target.textContent}</ReactLinkify>, target);
      });
    });
}, {
  threshold: 0.001,
});

function Linkify({ text }) {
  const item = useRef();

  useEffect(() => {
    observer.observe(item.current);
  }, []);

  return (
    <div ref={item}>
      {text}
    </div>
  );
}

Linkify.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Linkify;
