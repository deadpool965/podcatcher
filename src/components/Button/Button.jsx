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
  circle,
  small,
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
        + `${circle ? 'button--circle ' : ''}`
        + `${circle && small ? 'button--small-circle' : ''}`
        + `${!circle && small ? 'button--small' : ''}`
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
};

Button.defaultProps = {
  onClick: () => { },
  fullWidth: false,
  id: null,
  transparent: false,
  lightText: false,
  circle: false,
  small: false,
  ariaLabel: null,
};

export default Button;
