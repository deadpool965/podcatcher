import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Button.css';

function Button({
  children,
  onClick,
  fullWidth,
  ariaLabel,
  id,
  transparent,
  lightText,
  accentText,
  circle,
  pointy,
  small,
  border,
}) {
  const [flashAni, setFlashAni] = useState(false);

  function onButtonClick(evt) {
    evt.persist();
    onClick(evt);
    setFlashAni(true);
  }

  function onAnimationEnd() {
    setFlashAni(false);
  }

  return (
    <button
      id={id}
      className={'button '
        + `${fullWidth ? 'button--full-width' : ''} `
        + `${flashAni ? 'button--flash-ani' : ''} `
        + `${transparent ? 'button--transparent ' : ''}`
        + `${lightText ? 'button--light-text ' : ''}`
        + `${accentText ? 'button--accent-text ' : ''}`
        + `${circle ? 'button--circle ' : ''}`
        + `${pointy ? 'button--pointy ' : ''}`
        + `${circle && small ? 'button--small-circle ' : ''}`
        + `${!circle && small ? 'button--small ' : ''}`
        + `${border ? 'button--border ' : ''}`
      }
      type="button"
      onClick={onButtonClick}
      onAnimationEnd={onAnimationEnd}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
  ariaLabel: PropTypes.string,
  id: PropTypes.string,
  transparent: PropTypes.bool,
  lightText: PropTypes.bool,
  circle: PropTypes.bool,
  small: PropTypes.bool,
  accentText: PropTypes.bool,
  pointy: PropTypes.bool,
  border: PropTypes.bool,
};

Button.defaultProps = {
  onClick: () => { },
  fullWidth: false,
  id: null,
  transparent: false,
  lightText: false,
  accentText: false,
  circle: false,
  pointy: false,
  small: false,
  ariaLabel: null,
  border: false,
};

export default Button;
