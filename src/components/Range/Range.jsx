import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './Range.css';

function Range({
  min,
  max,
  step,
  value,
  label,
  onChange,
}) {
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [percentage, setPercentage] = useState((value / max) * 100);
  const handle = useRef();
  const path = useRef();

  useEffect(() => {
    if (isBrowsing) return;
    setPercentage((value / max) * 100);
  }, [value, isBrowsing, max]);

  function onKeyDown({ key }) {
    if (key === 'ArrowLeft') {
      let r = value - step;
      if (r < min) r = min;
      onChange(r);
    } else if (key === 'ArrowRight') {
      let r = value + step;
      if (r > max) r = max;
      onChange(r);
    }
  }

  function onMouseDown(evt) {
    evt.persist();
    setIsBrowsing(true);
  }

  useEffect(() => {
    function onMouseMove(evt) {
      if (!isBrowsing) return;

      const pathRect = path
        .current
        .getBoundingClientRect();
      const mouseX = evt.screenX;

      let pos = mouseX - pathRect.x;
      if (pos < 0) pos = 0;
      if (pos > pathRect.width) pos = pathRect.width;

      const pct = (pos / pathRect.width) * 100;
      setPercentage(pct);
    }

    function onMouseUp() {
      if (!isBrowsing) return;
      onChange((percentage / 100) * max);
      setIsBrowsing(false);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);
    };
  }, [isBrowsing, onChange, percentage, max]);

  return (
    <div className="range">
      <div
        ref={path}
        className="range__path"
      />
      <button
        type="button"
        role="slider"
        className="range__handle"
        ref={handle}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
}

Range.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Range;
