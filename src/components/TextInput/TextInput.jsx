import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './TextInput.css';

function TextInput({
  placeholder,
  onChange,
  name,
  icon,
  ariaLabel,
  defaultValue,
  clearButton,
  onClear,
}) {
  const $input = useRef();
  function clearInput() {
    $input.current.value = '';
    onClear();
  }

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
        ref={$input}
      />
      {clearButton && defaultValue
        ? (
          <button
            type="button"
            aria-label="Clear"
            className="text-input__clear-btn"
            onClick={clearInput}
          >
            <i
              className="icon ion-md-close"
              aria-hidden
            />
          </button>
        )
        : null}
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
  clearButton: PropTypes.bool,
  onClear: PropTypes.func,
};

TextInput.defaultProps = {
  placeholder: '',
  onChange: () => {},
  icon: '',
  defaultValue: '',
  clearButton: false,
  onClear: () => {},
};

export default TextInput;
