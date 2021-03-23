import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { history as historyPropTypes } from 'react-router-prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  componentDidMount() {
    const { history } = this.props;
    history.listen(() => {
      this.setState({ hasError: false, errorMessage: null });
    });
  }

  componentDidCatch(error, info) {
    console.error(error, info);
    this.setState({ hasError: true, errorMessage: error.message });
  }

  render() {
    const { children } = this.props;
    const { hasError, errorMessage } = this.state;
    if (hasError) {
      return (
        <div className="p-4">
          <Alert color="danger">
            Something is wrong.
            {' '}
            {errorMessage}
          </Alert>
        </div>
      );
    }
    return children;
  }
}

export default withRouter(ErrorBoundary);

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  history: historyPropTypes.isRequired,
};
