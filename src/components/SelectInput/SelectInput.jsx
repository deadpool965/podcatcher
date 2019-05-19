import React from 'react';
import PropTypes from 'prop-types';
import './SelectInput.css';

function SelectInput({
  id,
  name,
  onChange,
  options,
  ariaLabel,
  defaultValue,
}) {
  function mapOptions(opt) {
    return opt
      .map(({ label, value, group }) => {
        if (group) {
          return (
            <optgroup
              label={label}
              value={value}
              key={value}
            >
              {mapOptions(group)}
            </optgroup>
          );
        }

        return (
          <option key={label} value={value}>
            {label}
          </option>
        );
      });
  }

  return (
    <div className="select-input">
      <select
        id={id}
        className="select-input__input"
        name={name}
        aria-label={ariaLabel}
        onChange={onChange}
        defaultValue={defaultValue}
      >
        {mapOptions(options)}
      </select>
      <i className="select-input__icon icon ion-md-arrow-dropdown" />
    </div>
  );
}

SelectInput.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  name: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
};

SelectInput.defaultProps = {
  onChange: () => {},
  defaultValue: '',
};

export default SelectInput;
