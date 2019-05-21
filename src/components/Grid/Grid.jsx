import React from 'react';
import PropTypes from 'prop-types';
import './Grid.css';

function Grid({
  children,
  columns,
  rows,
}) {
  const style = {};
  if (columns) {
    style.gridTemplateColumns = columns;
  }

  if (rows) {
    style.gridTemplateRows = rows;
  }

  return (
    <div
      className="grid"
      style={style}
    >
      {children}
    </div>
  );
}

Grid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.string,
  rows: PropTypes.string,
};

Grid.defaultProps = {
  columns: null,
  rows: null,
};

export default Grid;
