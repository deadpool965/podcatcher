import React from 'react';
import PropTypes from 'prop-types';
import './TextInput.css';

function TextInput({
  placeholder,
  onChange,
  name,
  icon,
  ariaLabel,
  defaultValue,
}) {
  return (
    <div className="text-input">
      <input
        className="text-input__input"
        type="text"
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        aria-label={ariaLabel}
        defaultValue={defaultValue}
      />
      {icon ? <i className={`text-input__icon icon ion-md-${icon}`} /> : null}
    </div>
  );
}

TextInput.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  icon: PropTypes.string,
  ariaLabel: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
};

TextInput.defaultProps = {
  placeholder: '',
  onChange: () => {},
  icon: false,
  defaultValue: '',
};

export default TextInput;
