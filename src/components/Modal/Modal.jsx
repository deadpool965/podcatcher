/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

// The reason this file has so many
// eslint disabled rules is that we have a
// weird case here. The wrapper needs to be focusable
// and interactive, so we can immitate a dialog.

import React, {
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

function Modal({
  children,
  open,
  title,
  onClose,
}) {
  const outside = useRef();
  const dialog = useRef();

  function onClickOutside(evt) {
    if (evt.target !== outside.current) return;
    onClose();
  }

  function focusOnDialog() {
    dialog.current.focus();
  }

  useEffect(() => {
    if (!open) return;
    dialog.current.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return () => {};

    function onPressEsc({ key }) {
      if (key !== 'Escape' || !open) return;
      onClose();
    }

    window.addEventListener('keydown', onPressEsc);
    return () => {
      window.removeEventListener('keydown', onPressEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal"
      ref={outside}
      onClick={onClickOutside}
    >
      <div
        role="dialog"
        className="modal__dialog"
        tabIndex="0"
        ref={dialog}
      >
        <div
          className="modal__document"
          role="document"
        >
          <h5 className="modal__title">
            <div>
              {title}
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="modal__close-btn"
            >
              <i className="icon ion-md-close" />
            </button>
          </h5>
          <div className="modal__body">
            {children}
          </div>
        </div>
        <button
          type="button"
          aria-hidden
          tabIndex="0"
          className="modal__tab-trap"
          onFocus={focusOnDialog}
        />
      </div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default Modal;
