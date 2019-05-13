import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

function Button({
  children,
  onClick,
  fullWidth,
}) {
  return (
    <button
      className={`button ${fullWidth ? 'button--full-width' : ''}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
};

Button.defaultProps = {
  onClick: () => {},
  fullWidth: false,
};

export default Button;
