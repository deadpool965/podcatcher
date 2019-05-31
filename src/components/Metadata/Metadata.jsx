import { useEffect } from 'react';
import PropTypes from 'prop-types';

function Metadata({
  title,
  description,
}) {
  useEffect(() => {
    document.title = title;
    document.head.querySelector('meta[name=description]').setAttribute('content', description);
  }, [title, description]);
  return null;
}

Metadata.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Metadata;
