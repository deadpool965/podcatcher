import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

function Button({
  children,
  onClick,
  fullWidth,
  ariaLabel,
  id,
}) {
  return (
    <button
      id={id}
      className={`button ${fullWidth ? 'button--full-width' : ''}`}
      type="button"
      onClick={onClick}
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
  ariaLabel: PropTypes.string.isRequired,
  id: PropTypes.string,
};

Button.defaultProps = {
  onClick: () => { },
  fullWidth: false,
  id: null,
};

export default Button;
