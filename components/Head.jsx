import Head from 'next/head';
import PropTypes from 'prop-types';

function CustomHead({ title }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link href="https://fonts.googleapis.com/css?family=Bungee|Roboto" rel="stylesheet" />
      <link href="https://unpkg.com/ionicons@4.5.5/dist/css/ionicons.min.css" rel="stylesheet" />
    </Head>
  );
}

CustomHead.propTypes = {
  title: PropTypes.string,
};

CustomHead.defaultProps = {
  title: 'PodCatcher',
};

export default CustomHead;
