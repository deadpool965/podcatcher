import PropTypes from 'prop-types';

function TextInput({
  placeholder,
  onChange,
  name,
  icon,
  ariaLabel,
  defaultValue,
}) {
  return (
    <div className="wrapper">
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        aria-label={ariaLabel}
        defaultValue={defaultValue}
      />
      {icon ? <i className={`icon ion-md-${icon}`} /> : null}
      <style jsx>
        {`
          .wrapper {
            position: relative;
          }

          input {
            width: 100%;
            height: 40px;
            border-radius: 8px;
            border: 0px;
            padding: 16px;
            box-sizing: border-box;
            outline-style: none;
            background-color: var(--accent-bg-color);
            color: var(--text-color);
            font-size: 16px;
          }

          input::placeholder {
            color: var(--mute-color);
          }

          .icon {
            display: block;
            position: absolute;
            top: 50%;
            right: 16px;
            transform: translateY(-50%);
            pointer-events: none;
          }
        `}
      </style>
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
