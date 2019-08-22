import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { AUTH_PATH } from '../../shared/utils/api.constants';

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
    isAuthenticated: PropTypes.bool,
    requireAnonymous: PropTypes.bool,
    isUserFetched: PropTypes.bool,
    fetchCurrentUser: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isAuthenticated: false,
    requireAnonymous: false,
    isUserFetched: false,
  };

  renderRoute = () => <Route {...this.props} />;

  render() {
    const { isUserFetched, requireAnonymous, isAuthenticated, fetchCurrentUser } = this.props;

    if (!isUserFetched) {
      fetchCurrentUser();
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
    return <ExternalRedirect to={AUTH_PATH} />;
  }
}
