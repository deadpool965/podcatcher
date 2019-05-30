import React from 'react';
import PropTypes from 'prop-types';
import './Grid.css';

function Grid({
  children,
  columns,
  rows,
  style,
}) {
  const gridStyle = { ...style };

  if (columns) {
    gridStyle.gridTemplateColumns = columns;
  }

  if (rows) {
    gridStyle.gridTemplateRows = rows;
  }

  return (
    <div
      className="grid"
      style={gridStyle}
    >
      {children}
    </div>
  );
}

Grid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.string,
  rows: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};

Grid.defaultProps = {
  columns: null,
  rows: null,
  style: {},
};

export default Grid;
