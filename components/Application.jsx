import PropTypes from 'prop-types';
import Head from './Head';
import Container from './Container';
import Header from './Header';

function Application({ title, children }) {
  return (
    <div className="app">
      <Head title={title} />
      <Container>
        <Header />
      </Container>
      <Container>
        <main className="app__main">
          {children}
        </main>
      </Container>
      <style jsx global>
        {`
            .app {
              --main-bg-color: #232F34;
              --accent-bg-color: #4A6572;
              --accent-color: #F9AA33;
              --text-color: #FFF;
              --mute-color: #8C9CA4;
  
              display: block;
              position: absolute;
              top: 0px;
              left: 0px;
              width: 100%;
              height: 100%;
              color: var(--text-color);
              background-color: var(--main-bg-color);
              font-family: 'Roboto', sans-serif;
            }

            .app * {
              font-family: 'Roboto', sans-serif;
            }
          `}
      </style>
    </div>
  );
}

Application.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

Application.defaultProps = {
  title: 'Podcatcher',
  children: [],
};

export default Application;
