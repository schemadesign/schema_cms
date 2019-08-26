import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import browserHistory from '../shared/utils/history';
import App from './app.container';
import AuthRoute from './authRoute/authRoute.container';
import JWT from './jwt/jwt.container';
import { Home } from './home';
import { NotFound } from './notFound';
import { AUTH_PATH } from '../shared/utils/api.constants';

export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '/404',
};

export default class RootContainer extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/not-found" component={NotFound} anonymous />

        <App>
          <Switch>
            <AuthRoute exact path={ROUTES.HOME} component={Home} />

            <Route exact path="/login" render={() => browserHistory.push(AUTH_PATH)} />

            <Route exact path="/jwt" component={JWT} />

            <Route
              exact
              path="/jwt/:user/:token/"
              render={({ match }) => {
                const location = {
                  pathname: '/jwt',
                  state: {
                    user: match.params.user,
                    token: match.params.token,
                  },
                };

                return <Redirect to={location} />;
              }}
            />
          </Switch>
        </App>
      </Switch>
    );
  }
}
