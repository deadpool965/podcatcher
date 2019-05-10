import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Application from '../components/Application';
import TextInput from '../components/TextInput';

function Index({ router }) {
  const [q, setQ] = useState(router.query.q || '');
  const form = useRef();
  const title = q
    ? `Results for "${q}"`
    : null;

  function handleSubmit(e) {
    e.preventDefault();
    const { value: query } = form.current.q;
    setQ(query);
    window
      .history
      .pushState({}, title, `/?q=${encodeURI(query)}`);
  }

  return (
    <Application
      title={title}
    >
      <form
        onSubmit={handleSubmit}
        ref={form}
      >
        <TextInput
          name="q"
          placeholder="Search"
          icon="search"
          ariaLabel="Search"
          defaultValue={q}
        />
      </form>
    </Application>
  );
}

Index.propTypes = {
  router: PropTypes.shape({
    query: PropTypes.shape({
      q: PropTypes.string,
    }),
  }).isRequired,
};

export default withRouter(Index);
