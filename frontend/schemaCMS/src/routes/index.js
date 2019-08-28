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
import { List as ProjectsList } from './project/list';
import { View as ProjectView } from './project/view';

export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '/404',
  PROJECTS: '/projects',
};

export default class RootContainer extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/not-found" component={NotFound} anonymous />

        <App>
          <Switch>
            <AuthRoute exact path={ROUTES.HOME} component={Home} />

            <AuthRoute exact path={ROUTES.PROJECTS} component={ProjectsList} />
            <AuthRoute exact path={`${ROUTES.PROJECTS}/:id`} component={ProjectView} />

            <Route exact path="/login" render={() => browserHistory.push(AUTH_PATH)} />

            <Route exact path="/auth/confirm/" component={JWT} />

            <Route
              exact
              path="/auth/confirm/:user/:token/"
              render={({ match }) => {
                const location = {
                  pathname: '/auth/confirm/',
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
