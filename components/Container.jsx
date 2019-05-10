import PropTypes from 'prop-types';

function Container({ children }) {
  return (
    <div className="container">
      {children}
      <style jsx>
        {`
          .container {
            margin-right: auto;
            margin-left: auto;
            max-width: 768px;
            padding-left: 16px;
            padding-right: 16px;
            box-sizing: border-box;
          }
        `}
      </style>
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Container;
