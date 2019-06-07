import React from 'react';
import PropTypes from 'prop-types';
import './Container.css';

function Container({
  children,
  noPadding,
}) {
  return (
    <div className={`container ${noPadding
      ? 'container--no-padding'
      : ''}`}
    >
      {children}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  noPadding: PropTypes.bool,
};

Container.defaultProps = {
  noPadding: false,
};

export default Container;
