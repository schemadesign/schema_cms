import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';

class ExternalRedirect extends PureComponent {
  static propTypes = {
    to: PropTypes.string.isRequired,
  };

  componentDidMount() {
    window.location.replace(this.props.to);
  }

  render = () => null;
}

export class AuthRoute extends PureComponent {
  static propTypes = {
    isUserFetched: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    requireAnonymous: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isUserFetched: false,
    isAuthenticated: false,
    requireAnonymous: false,
  };

  renderRoute = () => <Route {...this.props} />;

  render() {
    const {
      isUserFetched,
      requireAnonymous,
      isAuthenticated,
    } = this.props;

    if (!isUserFetched) {
      return null;
    }

    if (isAuthenticated) {
      /**
       * This route is only viewable by unauthenticated users
       */
      if (requireAnonymous) {
        return <Redirect to="/" />;
      }

      /**
       * User has met all criteria and the route can be rendered
       */
      return this.renderRoute();
    }

    /**
     * This route is viewable by anonymous users
     */
    if (requireAnonymous) {
      return this.renderRoute();
    }

    /**
     * Redirect to register by default
     */
    return <ExternalRedirect to="/api/auth/login/auth0/" />;
  }
}
